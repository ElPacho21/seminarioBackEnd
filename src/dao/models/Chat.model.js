const mongoose = require('mongoose');

const collectionName = 'chat'

const chatSchema = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: "67aeb8c8183f4e79fe3714f7"
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
});

chatSchema.index({ admin: 1, client: 1 }, { unique: true });

const Chat = mongoose.model(collectionName, chatSchema)

module.exports = Chat