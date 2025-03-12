const mongoose = require('mongoose')

const collectionName = 'cart'

const cartSchema = new mongoose.Schema({
    products: {
        type: [
          {
            product: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'product'
            },
            quantity: {
              type: Number,
              required: true
            }
          }
        ],
        default: []
    }
})

cartSchema.pre(['find', 'findOne'], function(){
  this.populate('products.product')
})

const Cart = mongoose.model(collectionName, cartSchema)

module.exports = Cart