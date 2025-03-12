const jwt = require('jsonwebtoken');

const { privateKey } = require('../config/jwt.config');

const PRIVATE_KEY = privateKey

const generateToken = (user) => {
    const token = jwt.sign(user, PRIVATE_KEY, {expiresIn: '24h'})
    return token;
}

const verifyToken = (token) => {
    return jwt.verify(token, PRIVATE_KEY)
}

module.exports = { 
    generateToken,
    verifyToken
}