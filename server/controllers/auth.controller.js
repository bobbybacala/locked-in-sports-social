
// to export the functions for sign up / login / logout

import User from "../models/user.model.js"
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"

// import the sendwelcomemail from the emailhandler
// email handler has function of send mails
import { sendWelcomeEmail } from "../emails/emailHandlers.js"

import dotenv from "dotenv"
dotenv.config()


export const signup = async (req, res) => {
    // sign up functions in try catch
    try {
        // get the details from the request body
        const { name, username, email, password } = req.body

        // check if all fields are provided
        if (!name || !username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        // check if the email, username, phone number already exist or not
        const existingMail = await User.findOne({ email })
        if (existingMail) {
            return res.status(400).json({ Message: 'Email already Exist' })
        }

        const existingUsername = await User.findOne({ username })
        if (existingUsername) {
            return res.status(400).json({ Message: 'Username already taken' })
        }

        // check the length of the password
        if (password.length < 8) {
            return res.status(400).json({ Message: 'Password must be 8 characters long' })
        }

        // since it is now legitimate user, we can create the user
        // hash the password using bcrypt
        const salt = await bcrypt.genSalt(10)
        const hashedPasswd = await bcrypt.hash(password, salt)

        // create the user and save it 
        const user = new User({
            name,
            username,
            password: hashedPasswd,
            email
        })

        // save it
        await user.save()

        // generate a jwt token
        // we have to get the sign on the token to authorise the token
        // we have to pass the id of the user as payload and the secret key with which password is hashed and unhashed
        // jwt_payload: {id: user._id}
        // and the token expires in 3days
        // user._id because that how we have it in mongo db by default
        // console.log(`secret key is ${process.env.JWT_Secret}`)
        const token = jwt.sign({ userId: user._id }, process.env.JWT_Secret, { expiresIn: '3d' })

        // set the token in the cookie
        res.cookie("jwt-locked-in", token, {
            httpOnly: true, // prevents XSS attacks (A cross-site scripting (XSS) attack is a web security issue that allows cyber criminals to execute malicious scripts on legitimate websites. Attackers can use XSS to: Steal cookies, Compromise user accounts, Take over the session of a privileged user, and Rewrite the content of an HTML page.)
            maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days in milliseconds
            sameSite: "strict", //prevents CSRF attacks (Cross-site request forgery (CSRF) is a malicious attack that tricks a user into performing unwanted actions on a website or web application they are already authenticated for)
            secure: process.env.NODE_ENV === "production" // prevents man in the middle attack
        })

        // send a success message
        res.status(201).json({ message: 'User Registered Successfully' })

        // the profileUrl of any user will be http://lockedin.com/profile/<user.username>
        const profileUrl = process.env.CLIENT_URL + "/profile/" + user.username

        // send a welcome email to the user
        try {
            await sendWelcomeEmail(user.email, user.name, profileUrl)
        } catch (error) {
            console.log(`Error sending welcome mail to the user ${error}`)
        }

    } catch (error) {
        console.log(`Error signing Up ${error.message}`)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

// when user want to log in 
export const login = async (req, res) => {
    try {

        // check the credential from the request body
        // check username and password from the req body
        const { username, password } = req.body

        // check if username exist, if not send invalid credentials msg
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' })
        }

        // check for the password
        // now the password stored in the db is hashed password, therefore we check the hashsed passwords
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' })
        }

        // now that credentials are valid
        // generate a token for 3days
        // set a cookie
        const token = jwt.sign({ userId: user._id }, process.env.JWT_Secret, { expiresIn: '3d' })
        // set the token in the cookie
        await res.cookie("jwt-locked-in", token, {
            httpOnly: true, // prevents XSS attacks (A cross-site scripting (XSS) attack is a web security issue that allows cyber criminals to execute malicious scripts on legitimate websites. Attackers can use XSS to: Steal cookies, Compromise user accounts, Take over the session of a privileged user, and Rewrite the content of an HTML page.)
            maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days in milliseconds
            sameSite: "strict", //prevents CSRF attacks (Cross-site request forgery (CSRF) is a malicious attack that tricks a user into performing unwanted actions on a website or web application they are already authenticated for)
            secure: process.env.NODE_ENV === "production" // prevents man in the middle attack
        })

        console.log('Login Successful')
        res.send('Login Successful')
    } catch (error) {
        console.log('Internal Server Error while logging in', error)
        res.status(500).json({ message: 'Server Error' })
    }
}

// when user wants to logout
export const logout = (req, res) => {
    // clear the cookie and send a response message logout success
    res.clearCookie('jwt-locked-in')
    res.json({ message: 'Logout successful' })
}

// to get the current user
export const getCurrentUser = (req, res) => {
    try {
        // current user is the user in the request body
        res.json(req.user)
    } catch (error) {
        console.log(`Error getting the current user ${error.message}`)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}