# Locked-In Sports Social

**Locked-In Sports Social** is a social platform designed for the professional sports community. It aims to connect athletes, coaches, and sports enthusiasts, fostering engagement and collaboration within the sports industry.

## Features

- **User Profiles**: Create and manage personal profiles to showcase your sports journey.
- **Networking**: Connect with other professionals in the sports community.
- **Content Sharing**: Share updates, photos, and videos related to sports activities.
- **Events**: Organize and participate in sports events and discussions.

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/bobbybacala/locked-in-sports-social.git

2. **Navigate to the project directory**:

    ```bash
    cd locked-in-sports-social

3. **Install dependencies for the server**:

    ```bash
    cd server
    npm install

4. **Install dependencies for the client**:

    ```bash
    cd ../client
    npm install

# Usage

1. **Start the Server**:
   
   ```bash
   cd server
   npm start

2. **Start the Client App**:
   
   ```bash
   cd ../client
   npm start

# Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

# Create .env file in server

    PORT=5000
    MONGO_URI=<your_mongo_uri>

    JWT_SECRET=<yourverystrongsecret>

    NODE_ENV=development

    MAILTRAP_TOKEN=<your_mailtrap_token>
    EMAIL_FROM=mailtrap@demomailtrap.com
    EMAIL_FROM_NAME=<Your_Name>

    CLOUDINARY_API_KEY=<your_cloudinary_api_key>
    CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
    CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>

    CLIENT_URL=http://localhost:5173