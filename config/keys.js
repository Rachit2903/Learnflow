require('dotenv').config();
module.exports = {
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET,
    MONGO_CONNECTION_URI: process.env.MONGO_CONNECTION_URI,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    googleRedirectURI: process.env.GOOGLE_REDIRECT_URI,
}