const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS
}