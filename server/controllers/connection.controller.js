// script for functionalities of connections

import { response } from "express"
import { sendConnectionRequestAcceptedEmail } from "../emails/emailHandlers.js"
import ConnectionRequest from "../models/connectionRequest.model.js"
import Notification from "../models/notification.model.js"
import User from "../models/user.model.js"

export const sendConnectionRequest = async (req, res) => {

    // now we are going to send a connection request to another user, who page we are on currently
    // /request/:userId
    try {
        // get the user id from the params and sender is the current user and his id is in req.user._id from the protect route auth middleware
        const { userId } = req.params
        const senderId = req.user._id

        // you cant send a connection request to yourself
        if (userId === senderId.toString()) {
            return res.status(400).json({ message: 'You cannot send a connection request to yourself' })
        }

        // chek if you are already connected to this user or not
        if (req.user.connections.includes(userId)) {
            return res.status(400).json({ message: 'You are already connected to this user' })
        }

        // check if you have already sent a conection request to this user or not
        const existingRequest = await ConnectionRequest.findOne({
            sender: senderId,
            recipient: userId,
            // status should be pending
            status: 'pending'
        })
        if (existingRequest) {
            return res.status(400).json({ message: 'You have already sent a connection request to this user' })
        }

        // if not now create a new connection request
        const newRequest = new ConnectionRequest({
            sender: senderId,
            recipient: userId
        })

        // save the request
        await newRequest.save()

        // return the new connection request
        res.status(201).json({ message: 'Connection request sent successfully' })
    } catch (error) {
        console.log(`Error sending connection request ${error.message}`)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const acceptConnectionRequest = async (req, res) => {
    try {
        // now we are going to accept a connection request from another user, who has sent us the request
        // get the Id of the connection request from the params and recipient is the current user and his id is in req.user._id

        const { requestId } = req.params
        const userId = req.user._id // one who will accept the conn request, the one who receives the request

        // find the connection request by id and populate sneder and recipient so that we can later send a mail that connection request has been accepted
        const request = await ConnectionRequest.findById(requestId)
            .populate("sender", 'name email username') // take the email of the sender hence we can send them a mail that connection request has been accepted
            .populate("recipient", 'name username')

        // double check that userId is the recipient of the request, if not you cannot accept the request
        if (userId.toString() !== request.recipient._id.toString()) {
            return res.status(403).json({ message: 'Unauthorised: You cannot accept this connection request' })
        }

        // check if the request is already processed or not
        if (request.status !== 'pending') {
            return res.status(400).json({ message: 'Connection request already processed' })
        }

        // change the status of the request to accepted and save the request
        request.status = 'accepted'
        await request.save()

        // add both the users to each other's connections array
        // 1st add the sender to the recipient's connections array then add the recipient to the sender's connections array
        await User.findByIdAndUpdate(request.sender._id, { $addToSet: { connections: userId} })
        await User.findByIdAndUpdate(userId, { $addToSet: { connections: request.sender._id } })

        // send a notification to the recipient that connection request has been accepted
        const newNotification = new Notification({
            recipient: request.sender._id,
            type: 'connectionAccepted',
            relatedUser: userId
        })

        // save the Notification
        await newNotification.save()

        // response
        res.json({ message: 'Connection request accepted successfully' })

        // data needed to send the mail
        const senderEmail = request.sender.email
        const senderName = request.sender.name

        // in the mail we have to include the Url of the user's profile page who accepted the request
        const recipientName = request.recipient.name
        const profileUrl = process.env.CLIENT_URL + `/profile/` + request.recipient.username

        // now send an email to the sender that connection request has been accepted
        try {
            // email of the user who sent the request 
            await sendConnectionRequestAcceptedEmail(senderEmail, senderName, recipientName, profileUrl)
        } catch (error) {
            console.log(`Error sending connection request accepted mail ${error.message}`)
        }

    } catch (error) {
        console.log(`Error accepting connection request ${error.message}`)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const rejectConnectionRequest = async (req, res) => {
    try {
        // get the connection request id from the params
        const { requestId } = req.params
        const userId = req.user._id

        // ger the request
        const request = await ConnectionRequest.findById(requestId)

        // check if curreent user is the recipient of the request
        if (request.recipient.toString() !== userId.toString()) {
            return res.status(400).json({ message: 'Unauthorised: You cannot reject this connection request' })
        }

        // check if the request is already processed or not
        if (request.status !== 'pending') {
            return res.status(400).json({ message: 'Connection request already processed' })
        }

        // change the status to rejeced
        request.status = 'rejected'
        await request.save()

        res.json({ message: 'Connection request rejected' })
    } catch (error) {
        console.log(`Error rejecting connection request ${error.message}`)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const getConnectionRequests = async (req, res) => {
    try {
        // get all the connection requests of the current user
        const userId = req.user._id

        // get requests
        const requests = await ConnectionRequest.find({
            recipient: userId,
            status: 'pending'
        })
            .populate("sender", 'name username profilePicUrl headline connections')

        // send the response
        res.json(requests)
    } catch (error) {
        console.log(`Error getting connection requests ${error.message}`)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const getConnections = async (req, res) => {
    try {
        // get the user id
        const userId = req.user._id

        // get the user by id
        const user = await User.findById(userId)
            .populate("connections", 'name username profilePicUrl headline connections')

        res.json(user.connections)
    } catch (error) {
        console.log(`Error getting connections ${error.message}`)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const removeConnection = async (req, res) => {
    try {
        // get the current user and the user to be removed
        const currentUserId = req.user._id
        const { userId } = req.params // to be removed

        // remove the user from the current user's connections array
        await User.findByIdAndUpdate(currentUserId, { $pull: { connections: userId } })
        await User.findByIdAndUpdate(userId, { $pull: { connections: currentUserId } })

        res.json({ message: 'Connection removed successfully' })
    } catch (error) {
        console.log(`Error removing connection ${error.message}`)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const getConnectionStatus = async (req, res) => {
    try {
        // you need both users ids, yourself and the target userID
        const currentUserId = req.user._id
        const currentUser = req.user
        const targetUserId = req.params.userId

        // check if the target user is in the connections of the current user
        if (currentUser.connections.includes(targetUserId)) {
            return res.json({ status: 'connected' })
        }

        // check if the current user has sent a connection request to the target user or vice versa
        const pendingRequest = await ConnectionRequest.findOne({
            $or: [
                { sender: currentUserId, recipient: targetUserId },
                { sender: targetUserId, recipient: currentUserId }
            ],
            status: 'pending'
        })
        if (pendingRequest) {
            // if you have sent the request, then its pending, else you have received the request not answered yet
            if (pendingRequest.sender.toString() === currentUserId.toString()) {
                return res.json({ status: 'pending' })
            } else {
                return res.json({ status: 'received', requestId: pendingRequest._id })
            }
        }

        // if not connected send a response
        res.json({ status: 'not connected' })

    } catch (error) {
        console.log(`Error getting connection status ${error.message}`)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}