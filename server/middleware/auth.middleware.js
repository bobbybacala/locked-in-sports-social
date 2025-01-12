// middleware script for authorisation

import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

import dotenv from 'dotenv'
dotenv.config()


// middle for authentications

// ***any authenticted operation user has to go through this middleware***

// protectRoutes: for example now user want to delete/ add a post to userProfile
// not just anybody can access the page of the of current user and delete / add the post
// therefore they have to go through the protectRoutes, everyone has to pass the ProtectRoutes
// it check whether you are the actual user of whose userprofile page you are trying to access so that we can edit posts
// function for the protect routes
export const protectRoute = async (req, res, next) => {
    try {
        // extract the token from the cookies: jwt-locked-in
        const token = req.cookies['jwt-locked-in']

        // // debug
        // console.log(`token is ${token}`)
        // console.log(`secret key is ${process.env.JWT_Secret}`)

        // check if the token exists
        if (!token) {
            return res.status(401).json({ message: 'Unauthorised: No Token Provided' })
        }

        // check if the token is valid
        // steps to check if the token is valid or not:
        // 1. decode the token using jwt-secret key
        const decoded = jwt.verify(token, process.env.JWT_Secret)
        if (!decoded.userId) {
            return res.status(401).json({ message: 'Unauthorised: Invalid Token' })
        }

        // 2. finduserbyId if decoded token is found
        // now that we have a valid token
        // we had passed user.id at the time of signing the jwt token, extract that id and check if current id and id from token are same or not
        // if its same user can add/delete posts from his/her page else not
        // we dont need the password
        const user = await User.findById(decoded.userId).select('-password')
        if (!user) {
            console.log('User not found in database for ID:', decoded.userId)
            return res.status(401).json({ message: 'User not found' })
        }

        // put the user in the request body, because we need the user id later for authentication purposes
        req.user = user

        // user found
        // console.log('User Found')

        // call the next function when everything is done
        next()
    } catch (error) {
        console.log('Error in protectRoute Middleware', error.message)
        res.status(500).json({ message: 'INternal Server Error' })
    }
}