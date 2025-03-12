const mongoose = require('mongoose')

const collectionName = 'message'

const messageSchema = new mongoose.Schema({
    email: String,
    message: String,
    date: Date
});

const Message = mongoose.model(collectionName, messageSchema)

module.exports = Message