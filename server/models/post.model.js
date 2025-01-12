
// model for posts
import mongoose from "mongoose";
// it will be a mongoose schema
const { Schema } = mongoose

const postSchema = new Schema(
    {
        // author of the post is just an id of the user in the database
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String },
        // image is the cloudinary url
        image: { type: String },
        likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        comments: [
            {
                content: { type: String },
                user: { type: Schema.Types.ObjectId, ref: 'User' },
                createdAt: { type: Date, default: Date.now }
            }
        ]
    },
    {
        timestamps  : true
    }
)

// convert the schema into model and export the model
const Post = mongoose.model('Post', postSchema)

export default Post