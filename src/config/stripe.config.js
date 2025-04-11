const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeEndpointSecret: process.env.STRIPE_ENDPOINT_SECRET
}