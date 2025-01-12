// database functions
import mongoose from 'mongoose'
import dotenv from 'dotenv';
dotenv.config();

// function to connect to mongodb
export const connectDB = async () => {
    try {
        // try to connect inside try catch block
        const conn = await mongoose.connect(process.env.MONGO_URI)    
        console.log(`Mongo DB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(`Error connecting to Mongo DB ${error.message}`)
        process.exit(1)
    }
}