const mongoose = require('mongoose');

const collectionName = 'chat'

const chatSchema = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
})

const Chat = mongoose.model(collectionName, chatSchema)

module.exports = Chat