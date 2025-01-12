// script for template of emails to be served to users

// template for when successfully registered
export const welcomeEmailTemplate = (name, profileUrl) => {
  return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Locked In</title>
    <style>
        body {
            color: rgb(0, 0, 0);
            background: linear-gradient(to right, #444444, #222222);
        }
    </style>
</head>

<body
    style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div
        style="background: linear-gradient(to right, #b50000, #dc0000); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <img src="https://i.postimg.cc/D0Z066KF/locked-in-logo-w-text-compressed.png" 
     alt="Locked In Logo" style="width: 150px; margin-bottom: 20px; border-radius: 10px;">

        <h1 style="color: rgb(0, 0, 0); margin: 0; font-size: 28px;">Welcome to Locked In!</h1>
    </div>
    <div
        style="background-color: #000000; color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <p style="font-size: 18px; color: #b50000;"><strong>Hello ${name},</strong></p>
        <p>Welcome to Locked In — the ultimate platform for aspiring athletes and sports enthusiasts! We're excited to have you join our community, where you can connect with fellow athletes, clubs, and academies to pursue your dreams and elevate your game.</p>
        <div style="background-color: #2b2b2b; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 16px; margin: 0;"><strong>Here's how to get started:</strong></p>
            <ul style="padding-left: 20px;">
                <li>Build your profile to showcase your skills</li>
                <li>Connect with athletes, coaches, and teams</li>
                <li>Join groups and communities that match your sport and interests</li>
                <li>Explore opportunities to advance your career and go pro</li>
            </ul>
        </div>
        <div style="text-align: center; margin: 30px 0;">
            <a href="${profileUrl}"
                style="background-color: #b50000; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; transition: background-color 0.3s;">Complete
                Your Profile</a>
        </div>
        <p>If you have any questions or need support, our team is here to assist you every step of the way.</p>
        <p>Best regards,<br>The Locked In Team</p>
    </div>
</body>

</html>
`;
}

// template for when connection accepted by someone
export const connectionAcceptedEmailTemplate = (senderName, recipientName, profileUrl) => `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connection Request Accepted</title>
    <style>
        body {
            color: rgb(0, 0, 0);
            background: linear-gradient(to right, #444444, #222222);
        }
    </style>
</head>

<body
    style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div
        style="background: linear-gradient(to right, #b50000, #dc0000); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <img src="https://i.postimg.cc/D0Z066KF/locked-in-logo-w-text-compressed.png" 
     alt="Locked In Logo" style="width: 150px; margin-bottom: 20px; border-radius: 10px;">

        <h1 style="color: rgb(0, 0, 0); margin: 0; font-size: 28px;">Connection Accepted!</h1>
    </div>
    <div
        style="background-color: #000000; color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <p style="font-size: 18px; color: #b50000;"><strong>Hello ${senderName},</strong></p>
        <p>Exciting news! <strong>${recipientName}</strong> has accepted your connection request on Locked In.</p>
        <div style="background-color: #2b2b2b; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 16px; margin: 0;"><strong>What can you do next?</strong></p>
            <ul style="padding-left: 20px;">
                <li>Explore ${recipientName}'s profile to learn more about their journey</li>
                <li>Send a message to start collaborating or sharing tips</li>
                <li>Find mutual connections and shared sports interests</li>
            </ul>
        </div>
        <div style="text-align: center; margin: 30px 0;">
            <a href="${profileUrl}"
                style="background-color: #b50000; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; transition: background-color 0.3s;">View
                ${recipientName}'s Profile</a>
        </div>
        <p>Building strong connections is key to unlocking new opportunities and achieving your athletic goals. Keep networking and stay Locked In!</p>
        <p>Best regards,<br>The Locked In Team</p>
    </div>
</body>

</html>
`;

// template for when comment under your post
export const commentNotificationEmailTemplate = (recipientName, commenterName, postUrl, commentContent) => `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Comment on Your Post</title>
    <style>
        body {
            color: rgb(0, 0, 0);
            background: linear-gradient(to right, #444444, #222222);
        }
    </style>
</head>

<body
    style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div
        style="background: linear-gradient(to right, #b50000, #dc0000); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <img src="https://i.postimg.cc/D0Z066KF/locked-in-logo-w-text-compressed.png" alt="Locked In Logo"
            style="width: 150px; margin-bottom: 20px; border-radius: 10px;" />
        <h1 style="color: rgb(0, 0, 0); margin: 0; font-size: 28px;">New Comment on Your Post</h1>
    </div>
    <div
        style="background-color: #000000; color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <p style="font-size: 18px; color: #b50000;"><strong>Hello ${recipientName},</strong></p>
        <p>${commenterName} has shared their views on your post:</p>
        <div style="background-color: #2b2b2b; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="font-style: italic; margin: 0;">"${commentContent}"</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
            <a href=${postUrl}
                style="background-color: #b50000; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; transition: background-color 0.3s;">View
                Comment</a>
        </div>
        <p>Keep the conversation going by replying to comments and engaging with your fellow athletes. Every interaction
            brings you closer to building meaningful connections.</p>
        <p>Best regards,<br>The Locked In Team</p>
    </div>
</body>

</html>
`;