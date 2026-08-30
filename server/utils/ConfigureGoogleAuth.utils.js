const {google} = require("googleapis");


const GoogleClientID = process.env.GoogleClientID;
const GoogleSecretKey = process.env.GoogleSecretKey;


const oauth2Client = new google.auth.OAuth2(
    GoogleClientID,
    GoogleSecretKey,
    "postmessage"
);

module.exports = oauth2Client;