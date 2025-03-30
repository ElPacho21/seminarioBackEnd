const mongoose = require('mongoose')

const collectionName = 'consult'

const consultSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answer: String,
    date: Date,
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    }
})

const Consult = mongoose.model(collectionName, consultSchema)

module.exports = Consult