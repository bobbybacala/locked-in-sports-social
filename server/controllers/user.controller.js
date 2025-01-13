// for the functions of user routes
// functions like: getsuggestedconnections, 

import cloudinary from "../libs/cloudinary.js"
import User from "../models/user.model.js"

// function to get the sugessted connections
export const getSuggestedConnections = async (req, res) => {

    try {
        // get the current user
        const currentUser = await User.findById(req.user._id).select('connections')

        // now we have to suggest the users which are not in the connections of the current user and not the current user
        // to display suggested users we are going to need their profile picture(profilePicUrl), name, headline, username
        const sugesstedUsers = await User.find({
            // not current user
            // not in the connections of the current user
            _id: {
                $ne: req.user._id,
                $nin: currentUser.connections
            }
        })
            .select('name username headline profilePicUrl')
            .limit(5) //suggest 5 users

        // send the suggested users as a response
        res.json(sugesstedUsers)
    } catch (error) {
        console.log(`Error getting suggested connections ${error.message}`)
        res.status(500).json({ message: 'Internal Server Error' })
    }

}

// function to get the public profile page of any user
export const getPublicProfile = async (req, res) => {

    try {

        // the user id of the user who's profile we wanna see is in the params, therefore get the user from there
        const user = await User.findOne({ username: req.params.username }).select('-password')

        // check if user found or not
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        // if found send it as a response
        console.log('User Found')
        res.json(user)
    } catch (error) {
        console.log(`Error getting public profile ${error.message}`)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

// function to update the user Profile, ie user want to update their profilepicture, name, number, password, etc
export const updateProfile = async (req, res) => {

    try {
        // allow the user to only update the given selected fields
        const allowedFields = [
            'name',
            'username',
            'about',
            'headline',
            'profilePicUrl',
            'location',
            'achievement',
            'sportsEducation',
            'positions',
            'skill',
            'experience',
            'coverPic',
            'sports',
            'socialLinks',
        ]

        // we will get the updated fields from the request body
        const updatedData = {}

        // loop through the allowed fields
        for (const field of allowedFields) {
            // since the field is in request body, store it in updatedData object
            if (req.body[field]) {
                updatedData[field] = req.body[field]
            }
        }

        // lets cover coverPic and profilePicUrl later we will upload to cloudinary
        // if profilePicUrl is in the request body, store it in updatedData object
        if (req.body.profilePicUrl) {
            // result is an object of the uploaded image, it has a public_id and a secure_url
            const result = await cloudinary.uploader.upload(req.body.profilePicUrl)

            // store the secure url in the updatedData object
            updatedData['profilePicUrl'] = result.secure_url
        }

        if (req.body.coverPic) {
            // result is an object of the uploaded image, it has a public_id and a secure_url
            const result = await cloudinary.uploader.upload(req.body.coverPic)

            // store the secure url in the updatedData object
            updatedData['coverPic'] = result.secure_url
        }

        // now update the user, remember? that we added a user field in req body in the protectRoute middleware, it has the _id of the user
        const updatedUser = await User.findByIdAndUpdate(req.user._id, { $set: updatedData }, { new: true }).select('-password')

        // send the updated user as a response
        res.json(updatedUser)

        console.log('User Profile Updated')
    } catch (error) {
        console.log(`Error updating profile ${error.message}`)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}