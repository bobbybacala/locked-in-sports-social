// script for notification routes
import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js'
import { getUserNotifications, markNotificationAsRead, deleteNotification } from '../controllers/notification.controller.js'

// create an instance of the router
const notificationRouter = express.Router()

// the routes for notifications are:
// get all user notifications
notificationRouter.get('/', protectRoute, getUserNotifications)

// mark notification as read
notificationRouter.put('/:id/read', protectRoute, markNotificationAsRead)

// delete notification
notificationRouter.delete('/:id', protectRoute, deleteNotification)

// export the router
export default notificationRouter