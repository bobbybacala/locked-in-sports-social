
// the routes for the authenticating functionalities
// sign up
// login
// logout

import express from 'express'
import { getCurrentUser, login, logout, signup } from '../controllers/auth.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js'

// create a router 
const authRouter = express.Router()

// post function requests
authRouter.post('/signup', signup)
authRouter.post('/login', login)
authRouter.post('/logout', logout)

// for an authenticated user, wants his/her profile page
authRouter.get('/me', protectRoute, getCurrentUser)

// export the router
export default authRouter