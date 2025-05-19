const jwt = require('jsonwebtoken');

const { privateKey } = require('../config/jwt.config');

const PRIVATE_KEY = privateKey

const generateToken = (user) => {
    const token = jwt.sign(user, PRIVATE_KEY, {expiresIn: '24h'})
    return token;
}

const verifyToken = (token) => {
    const user = jwt.verify(token, PRIVATE_KEY)
    return user
}

const generateTokenForPassword = (id) => {
    const token = jwt.sign({id}, PRIVATE_KEY, {expiresIn: 1800000})
    return token;
}

module.exports = { 
    generateToken,
    verifyToken,
    generateTokenForPassword
}