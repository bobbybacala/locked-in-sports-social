
// the schema for the user of the social media who is any kind of athlete
// each schema maps to a mongo db collection

import mongoose from "mongoose";

const { Schema } = mongoose

// to create the model
// create the schema of the model
// convert the schema to the model

const userSchema = new Schema({
    // the attributes of the user we gonna need
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: [8, 'Password must be 8 characters long']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        // regex for validation of the email
    },
    profilePicUrl: {
        // it will be uploaded to a bucket and its string will be stored
        type: String,
        default: ""
    },
    coverPic: {
        // it will be uploaded to a bucket and its string will be stored
        type: String,
        default: ""
    },
    location: {
        type: String,
        default: "Earth"
    },
    about: {
        type: String,
        maxlength: [500, 'Bio cannot be more than 500 characters']
    },
    headline: {
        type: String,
        default: 'Locked-in Athlete'
    },

    // part of any academy / club, we are going to have a different schema for it
    experience: [{
        title: String,
        institute: String,
        desc: String,
        startDate: Date,
        endDate: Date
    }],


    // any titles won etc, for any club / academy / individual award / team
    achievement: [{
        title: String,
        // individual award / team
        category: String,
        // CLUB / ACADEMY / INDIVIDUAL AWARD / TEAM
        achievedFor: String,
        titleDesc: String,
        achievedDate: Date
    }],

    sportsEducation: [{
        title: String,
        institute: String,
        sport: String,
        startDate: Date,
        endDate: Date,
    }],

    // each user has connection, therefore it can be an array of the user id, the current user is connected with
    connections: [{
        // its type is userId
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    
    socialLinks: {
        instagram: String,
        twitter: String,
        linkedin: String
    },

    skill: [String],

    name: {
        type: String,
        required: true
    }
},
    // we need the timestamp when the user was created
    {
        timestamps: true
    }
)

// convert it to a model mongoose.model(modelName, schemaName)
const User = mongoose.model('User', userSchema)

// export the model
export default User