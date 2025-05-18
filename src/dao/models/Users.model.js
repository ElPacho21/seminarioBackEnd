const mongoose = require('mongoose');

const collectionName = 'user'

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true
    },
    nickName: {
        type: String,
        unique: true
    },
    password: String,
    role: {
        type: String,
        enum: ['admin', 'client'],
        default: 'client'
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cart'
    },
    resetToken: String,
    resetTokenExpires: Date,
    avatar: {
        type: String,
        default: 'default-avatar.webp'
    },
    country: {
        type: String,
        default: 'Argentina'
    }
})

const User = mongoose.model(collectionName, userSchema)

module.exports = User