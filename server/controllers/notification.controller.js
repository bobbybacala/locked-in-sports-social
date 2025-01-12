
// import the Notification model
import Notification from "../models/notification.model.js";

// for the functionalities of the notifications

// get all user notifications
export const getUserNotifications = async (req, res) => {
    // notification can be of post liked, comment, connection etc
    try {
        // get all the notifications for the current user
        // we might need stuff like profile pic, username, name, content of the post (image if there) etc
        // whenever we are getting a notification, we have to populate somw fields of author of the notification
        const notifications = await Notification.find({ recipient: req.user._id })
            .populate("relatedUser", 'name username profilePicUrl')
            .populate("relatedPost", 'content image')


        // send the notifications as a response
        res.status(200).json(notifications)
    } catch (error) {
        console.log(`Error getting notifications ${error.message}`)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

// mark notification as read
export const markNotificationAsRead = async (req, res) => {
    const notificationId = req.params.id

    try {
        const notification = await Notification.findByIdAndUpdate(
            // we add the notification id here, so that we can delete it later
            { _id: notificationId, recipient: req.user._id },
            { read: true },
            { new: true }
        )

        res.status(200).json(notification)
    }
    catch (error) {
        console.log(`Error marking notification as read ${error.message}`)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

// delete a notification
export const deleteNotification = async (req, res) => {
    // get the notification id
    const notificationId = req.params.id

    try {
        // delete the notification using the notification id
        await Notification.findOneAndDelete({
            _id: notificationId,
            recipient: req.user._id
        })

        res.status(200).json({ message: 'Notification deleted successfully' })
    } catch (error) {
        console.log(`Error deleting notification ${error.message}`)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}