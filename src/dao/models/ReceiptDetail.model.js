const mongoose = require('mongoose')

const collectionName = 'receipt-detail'

const receiptDetailSchema = new mongoose.Schema({
    quantity: Number,
    receipt: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'receipt'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    },
    mount: Number
})

const ReceiptDetail = mongoose.model(collectionName, receiptDetailSchema)

module.exports = ReceiptDetail