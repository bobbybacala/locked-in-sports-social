
// to handle the function of the email to send

// we send an email on welcome, when new comment under a post, connection accepted

// import the client and the sender frmo the mailtrap.js file
import { client, sender } from "../libs/mailtrap.js";
import { commentNotificationEmailTemplate, connectionAcceptedEmailTemplate, welcomeEmailTemplate } from "./emailTemplate.js";

// the function to send the mail
export const sendWelcomeEmail = async (email, name, profileUrl) => {
    // the recipient is the user who just registered to our system
    // the recipient is an array of objects as per the documentation of the mailtrap
    const recipient = [{ email }]

    try {
        const response = await client.send({
            from: sender,
            to: recipient,
            subject: "Welcome to Locked In",
            html: welcomeEmailTemplate(name, profileUrl),
            category: "Welcome Mail"
        })

        console.log('Welcome Mail send successfully', response)
    } catch (error) {
        console.log('THere was an error sending welcome mail', error)
    }
}

// function to send the mail on comment notification
export const sendCommentNotificationEmail = async (
    recipientEmail,
    recipientName,
    commenterName,
    postUrl,
    commentContent
) => {
    // the recipient is the user who got a comment under his post
    // in the mailtrap documentation, the recipient is an array of objects , therefore email is passed an arr of object
    const recipient = [{ email: recipientEmail }]

    // send the mail using mailtrap client
    try {

        // get the response
        const response = await client.send({
            from: sender,
            to: recipient,
            subject: "New Comment Under Your Post",
            html: commentNotificationEmailTemplate(recipientName, commenterName, postUrl, commentContent),
            category: "Comment_Notification"
        })

        // send a msg
        console.log('Comment Notification Mail send successfully', response)
    } catch (error) {
        console.log('THere was an error sending comment notification mail', error)
    }
}

// function to send the mail on connection request accepted
export const sendConnectionRequestAcceptedEmail = async (
    senderEmail,
    senderName,
    recipientName,
    profileUrl
) => {
    // the mail recipient is the one who sent the connection request and he will get a mail that conn acc
    const recipient = [{ email: senderEmail }]

    // send the mail using mailtrap client
    try {
        const response = await client.send({
            from: sender,
            to: recipient,
            subject: `${recipientName} accepted your Connection Request`,
            html: connectionAcceptedEmailTemplate(senderName, recipientName, profileUrl),
            category: "Connection_Request_Accepted"
        })

        console.log('Connection Request Accepted Mail send successfully', response)
    } catch (error) {
        console.log('THere was an error sending connection request accepted mail', error)
    }
}