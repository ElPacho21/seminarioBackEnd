require('dotenv').config()

module.exports = {
    port: process.env.PORT || 8080,
    frontEndUrl: process.env.FRONTEND_URL,
    backEndUrl: process.env.BACKEND_URL
}