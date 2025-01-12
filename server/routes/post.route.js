
// script for post routes
import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js'
import { createComment, createPost, deletePost, getFeedPosts, getPostById, likePost } from '../controllers/post.controller.js'

// create a router object
const postRouter = express.Router()

// routes for posts are:
// get all the posts for the feed
postRouter.get('/', protectRoute, getFeedPosts)

// create a post
postRouter.post('/create', protectRoute, createPost)

// delete a post
postRouter.delete('/delete/:id', protectRoute, deletePost)

// get a single post
postRouter.get('/:id', protectRoute, getPostById)

// commeent under a post
postRouter.post('/:id/comment', protectRoute, createComment)

// to like a post
postRouter.post('/:id/like', protectRoute, likePost)

// exoprt the router
export default postRouter