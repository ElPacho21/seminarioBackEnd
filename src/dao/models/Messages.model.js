const mongoose = require('mongoose')

const collectionName = 'message'

const messageSchema = new mongoose.Schema({
    message: String,
    date: Date,
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chat'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
});

const Message = mongoose.model(collectionName, messageSchema)

module.exports = Message