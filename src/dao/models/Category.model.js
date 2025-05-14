const mongoose = require('mongoose')

const collectionName = 'category'

const consultSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
})

const Category = mongoose.model(collectionName, consultSchema)

module.exports = Category