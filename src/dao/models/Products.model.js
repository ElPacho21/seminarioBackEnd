const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const collectionName = 'product'

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    code: String,
    price: Number,
    status: Boolean,
    stock: Number,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    },
    thumbnails: [String]
})

productSchema.plugin(mongoosePaginate)

const Product = mongoose.model(collectionName, productSchema)

module.exports = Product