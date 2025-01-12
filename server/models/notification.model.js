import mongoose from "mongoose";

const { Schema } = mongoose

const notificationSchema = new Schema(
    {
        recipient:{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        type: {
            type: String,
            required: true,
            enum: ['like', 'comment', 'connectionAccepted']
        },
        // which user is related to this notification ie user who commented or liked the post, or accepted the connection
        relatedUser: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        // on which post does the notificiaiton is related
        relatedPost: {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        },
        // is the notification read or not
        read: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

// convert the schema to model and export it
const Notification = mongoose.model('Notification', notificationSchema)

export default Notification