
// for the user routes
import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js'
import { getPublicProfile, getSuggestedConnections, updateProfile } from '../controllers/user.controller.js'
// create a userRouter
const userRouter = express.Router()

// routes for the user are:
// route for getting the suggested connections
userRouter.get('/suggestions', protectRoute, getSuggestedConnections)

// route for getting the public profile page, ie you want to view someone else's profile page
// locked-in.com/profile/susmit
userRouter.get('/:username', protectRoute, getPublicProfile)

// route to update users profile
userRouter.put('/profile', protectRoute, updateProfile)

// export the router
export default userRouter