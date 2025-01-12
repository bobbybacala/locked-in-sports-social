
// script to send the mail to the user on registering to our system
import { MailtrapClient } from "mailtrap";

import dotenv from 'dotenv'
dotenv.config()

// we have to create a token
const TOKEN = process.env.MAILTRAP_TOKEN;

// create an object of mailtrap to send the mails
export const client = new MailtrapClient({
    token: TOKEN,
});

// the sender mail
export const sender = {
    email: process.env.MAILRAP_EMAIL,
    name: process.env.MAILRAP_NAME,
};