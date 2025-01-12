
// model for connection request
import mongoose from "mongoose";

const { Schema } = mongoose

// schema for connection request
const connectionRequestSchema = new Schema({
    // it will have a sender, recipient, status, createdAt
    // sender and recipient will be ids
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
}, {
    timestamps: true
})


// convert the schema into a model
const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema)

// export the model
export default ConnectionRequest