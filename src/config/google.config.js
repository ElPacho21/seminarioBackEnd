const dotenv = require('dotenv');

dotenv.config()

module.exports = {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
}