import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser' // to parse all the cookies
import path from 'path'

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

// get the directory name
const __dirname = path.resolve()

// for the env variables
dotenv.config()

// for cors, we only need in development
if (process.env.NODE_ENV !== 'production') {
	app.use(
		cors({
			origin: 'http://localhost:5173',  // where the react app will be hosted
			credentials: true   // for cookies
		})
	)
}
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

// for the static files, as we want to serve the html 
// we want our server and client to run on the same port
if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, "/client/dist")))

	// we need to get all our apis and serve the html
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
	})
}

app.listen(port, () => {
	console.log(`Example app listening on port http://localhost:${port}`)
	// connect to be DB
	connectDB()
})