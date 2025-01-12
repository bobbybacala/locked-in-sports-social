// for the functionalities of the posts
import Post from "../models/post.model.js"
import Notification from "../models/notification.model.js"

// import cloudinary
import cloudinary from "../libs/cloudinary.js"
import { sendCommentNotificationEmail } from "../emails/emailHandlers.js"

// display the posts of the connected users in the main feed
// connections are in req.user.connections
export const getFeedPosts = async (req, res) => {
    try {
        // during displaying a post we have to display Name headline and profile picture and time when post was created that can be done using populate method
        // and to show comments we also have to populate the comments with users who have commented
        // we have to grab all the required fields: name usrename headline profilePicUrl from the user and name profilePicUrl from the connections who commented usnig populate function
        // sort the post by time they were created at, recent post will be on top therefore -1
        // we also want to display our own posts we use spread opearator and then push our own post to the array
        const posts = await Post.find({ author: { $in: [...req.user.connections, req.user._id] } })
            .populate("author", 'name username headline profilePicUrl')
            .populate("comments.user", 'name profilePicUrl')
            .sort({ createdAt: -1 })

        // send the posts as a response
        res.status(200).json(posts)
    } catch (error) {
        console.log(`Error getting feed posts ${error.message}`)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

// create a new post
// the contents to be posted should be in the request body
// _______________the request body is the structure which is the schema of the post___________
export const createPost = async (req, res) => {
    try {
        // i want to see what the request body looks like
        // console.log(req.body)

        // get the contents and image from the req body
        const { content, image } = req.body

        // create a new post
        let newPost

        // check if the image is provided or not
        if (image) {
            // if yes upload the img to cloudinary
            const result = await cloudinary.uploader.upload(image)

            newPost = new Post({
                author: req.user._id,
                content,
                image: result.secure_url
            })
        } else {
            // image is not provided therefore onlly contents
            newPost = new Post({
                author: req.user._id,
                content
            })
        }

        // save the post to DB and send the response
        await newPost.save()
        // status code 201 means resource has been created
        res.status(201).json(newPost)
    } catch (error) {
        console.log(`Error creating post ${error.message}`)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

// to delete a post
export const deletePost = async (req, res) => {
    try {

        // to delete the post get the post id from the params and get the author of the post
        const postId = req.params.id
        const userId = req.user._id

        // find the post by id from the database
        const post = await Post.findById(postId)

        // check if the post is there or not if not return an error
        if (!post) {
            return res.status(404).json({ message: 'Post not found' })
        }

        // check if the current user is the author of post or not
        // the author of the post is stored in the db in object form therefore convert it to string
        if (post.author.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this post' })
        }

        // check if the post has an image
        if (post.image) {
            // delete the image from the cloudinary as well
            // now when we upload an image to cloudinary we get the secure_url of the image 
            // in that secure_url is the image id which is used to delete the image from cloudinary
            // link: https://res.cloudinary.com/demo/image/upload/v1312461204/bsfdfgfdgdb.jpg
            // only want the img id : 'bsfdfgfdgdb'
            // split the link by '/' and get the last part by pop() which is the image id
            // then split the last part with '.' and get the part before the '.'
            const imageId = post.image.split('/').pop().split('.')[0]

            // delete the image
            await cloudinary.uploader.destroy(imageId)
        }

        // delete the post from the database
        await Post.findByIdAndDelete(postId)

        // return a msg
        res.status(200).json({ message: 'Post deleted successfully' })

    } catch (error) {
        console.log(`Error deleting post ${error.message}`)
        res.status(500).json({ message: 'Internal Server Error' })
    }

}

// get a single post
export const getPostById = async (req, res) => {
    try {
        // get the post id from the params and then get the post
        const postId = req.params.id

        // since the post is found get the authors name, profilePicUrl, headline and username we have to send this to react app
        // also users who have commented on the post
        const post = await Post.findById(postId)
            .populate("author", 'name username headline profilePicUrl')
            .populate("comments.user", 'name profilePicUrl headline, username')

        // check if the post is there or not
        if (!post) {
            return res.status(404).json({ message: 'Post not found' })
        }

        // and send the post as a response
        res.status(200).json(post)

    } catch (error) {
        console.log(`Error getting post by id ${error.message}`)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

// comment under a post
export const createComment = async (req, res) => {
    try {

        // get the post id from the params, user id who has commented as well
        const postId = req.params.id
        const userId = req.user._id

        // get the comment from the request body
        const { comment } = req.body

        // find the postbyId and update the comments
        // also grab the author of the post suing populate, since we want to send an email to author
        const post = await Post.findByIdAndUpdate(postId, {
            // push the comment to comments array
            $push: { comments: { user: userId, content: comment } }
        }, { new: true })
            .populate("author", 'name username headline profilePicUrl email')

        // create a notification and send an email to the author of the post
        // make a check before that the author of the post is not the same as the user who has commented
        if (userId.toString() !== post.author._id.toString()) {
            const newNotification = new Notification({
                recipient: post.author,
                type: 'comment',
                relatedUser: userId,
                relatedPost: post._id
            })

            // save the notification to DB
            await newNotification.save()

            // send an email to the author of the post
            try {

                // construt the post url on which comment is made, const postUrl = `http://localhost:3000/post/${post._id}`
                const postUrl = process.env.CLIENT_URL + '/post/' + postId

                // while sending the mail, we want to include things: author email, author name, username, postUrl on which comment is made, comment content
                await sendCommentNotificationEmail(
                    post.author.email,
                    post.author.name,
                    req.user.name,
                    postUrl,
                    comment
                )
            } catch (error) {
                console.log(`Error sending email ${error.message}`)
            }

            res.status(200).json(post)
        }
    } catch (error) {
        console.log(`Error creating comment ${error.message}`)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

// to like a post
export const likePost = async (req, res) => {
    try {
        // when any user likes a post, we have to update the post by adding the user id to the likes array
        // get the post id and user if from the req params
        const postId = req.params.id
        const userId = req.user._id

        // now get the post by id and update the likes array
        const post = await Post.findById(postId)
        // check if post is there or not
        if (!post) {
            return res.status(404).json({ message: 'Post not found' })
        }

        // check if the user has already liked the post or not
        if (post.likes.includes(userId)) {
            // unlike the post
            // filter out the user id from the likes array of the post
            // filter out the id where id is not the same as the user id
            post.likes = post.likes.filter(id => id.toString() !== userId.toString())
        } else {
            // like the post
            // push the user id to the likes array of the post
            post.likes.push(userId)

            // create a notification if the user who has liked the post is not the author of the post
            if (userId.toString() !== post.author.toString()) {
                const newNotification = new Notification({
                    recipient: post.author,
                    type: 'like',
                    relatedUser: userId,
                    relatedPost: postId
                })

                // save the notification to DB
                await newNotification.save()

            }
        }
        // save the post
        await post.save()

        // send post as response
        res.status(200).json(post)

    } catch (error) {
        console.log(`Error liking post ${error.message}`)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}