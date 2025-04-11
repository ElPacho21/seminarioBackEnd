const dotenv = require('dotenv');

dotenv.config()

module.exports = {
    githubClientID: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
}