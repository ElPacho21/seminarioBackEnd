const mongoose = require('mongoose')

const collectionName = 'receipt'

const receiptSchema = new mongoose.Schema({
    date: Date,
    totalMount: Number
})

const Receipt = mongoose.model(collectionName, receiptSchema)

module.exports = Receipt