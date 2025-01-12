import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser' // to parse all the cookies

const app = express()
const port = 3000

// import the authrouter
import authRouts from './routes/auth.route.js'
import userRouts from './routes/user.route.js'
import postRouts from './routes/post.route.js'
import notificationRouts from './routes/notification.route.js'
import connectionRouts from './routes/connection.route.js'
import cors from 'cors'
import { connectDB } from './libs/db.js'

// for the env variables
dotenv.config()

// for cors
app.use(
	cors({
		origin: 'http://localhost:5173',  // where the react app will be hosted
		credentials: true   // for cookies
	})
)
// parse the json body
// for the image , set the limit as 5mb, else we get the error payload too large
app.use(express.json({ limit: '50mb' }))
app.use(cookieParser())

// we gonna need the auth routes
// its a good practice to version your apis since your customers still want to use the older version

// for authentication routes
app.use('/api/v1/auth', authRouts)

// for user routes
app.use('/api/v1/users', userRouts)

// for post routes
app.use('/api/v1/posts', postRouts)

// for notification routes
app.use('/api/v1/notifications', notificationRouts)

// for connection routes
app.use('/api/v1/connections', connectionRouts)

app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.listen(port, () => {
	console.log(`Example app listening on port http://localhost:${port}`)
	// connect to be DB
	connectDB()
})