const mongoose = require('mongoose')

const collectionName = 'message'

const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chat',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    }
});

const Message = mongoose.model(collectionName, messageSchema)

module.exports = Message