const mongoose = require('mongoose')
const Cart = require('../models/Carts.model')

class CartDao {
    constructor() {

    }
    async findAll() {
        try {
            return await Cart.find()
        } catch(error){
            console.error('Error al obtener carritos: ', error.message)
            throw new Error('Error al obtener carritos: ', error.message)
        }
    }

    async findById(cid){
        try {
            return await Cart.findOne({ _id: cid})
        } catch(error){
            console.error('Error al obtener carrito: ', error.message)
            throw new Error('Error al obtener carrito: ', error.message)
        }
    }

    async insertOne(cart){
        try {
            const newCart = await Cart.create(cart)
            console.log(newCart)
            return newCart
        } catch(error){
            console.error('Error al agregar carrito: ', error.message)
            throw new Error('Error al agregar carrito: ', error.message)
        }
    }
    async insertProductToCart(cid, pid, productData){
        try {
            const cartFound = await Cart.findById(cid)
            if(!cartFound) {
                throw new Error('No existe carrito con ese ID')
            }
            if(!productData.hasOwnProperty('quantity') || productData.quantity === undefined){
                productData.quantity = 1
            }
            const productFound = await Cart.findOne({ _id: cid, 'products.product': new mongoose.Types.ObjectId(pid) })
            if(productFound){
                return await Cart.updateOne(
                    { _id: cid, 'products.product': new mongoose.Types.ObjectId(pid) },
                    { $inc: { 'products.$.quantity': productData.quantity } }
                  );
            } else {
                return await Cart.updateOne({ _id: cid }, { $push: { products: productData } })
            }
        } catch(error){
            console.error('Error al agregar producto al carrito: ', error)
            throw new Error('Error al agregar producto al carrito: ', error.message)
        }
    }
        
    async removeProductFromCart(cid, pid){
        try {
            const cartFound = await Cart.findById(cid)
            if(!cartFound) throw new Error('No existe carrito con ese ID')
            const productFound = await Cart.findOne({_id: cid, 'products.product': new mongoose.Types.ObjectId(pid) })
            if(productFound){
                await Cart.updateOne( {_id: cid, 'products.product': new mongoose.Types.ObjectId(pid) }, { $pull: { products: { product: new mongoose.Types.ObjectId(pid) }}})
            } else {
                console.error(`No se encontró el producto con id ${pid}`)
                throw new Error(`No se encontró el producto con id ${pid}`)
            }
        } catch (error) {
            console.error('Error al eliminar producto del carrito: ', error)
            throw new Error('Error al eliminar producto del carrito: ', error)
        }
    }

    async updateOne(cid, products) {
        try {
            console.log(products)
            await Cart.updateOne( {_id: cid}, products)
        } catch (error) {
            console.error('Error al actualizar carrito con id: ' + cid, error.message)
            throw new Error('Error al actualizar carrito con id: ' + cid, error.message)
        }
    }

    async deleteById(cid){
        try {
            await Cart.findByIdAndDelete(cid)
        } catch (error) {
            console.error(`Error al eliminar carrito con id ${cid}: `, error.message)
            throw new Error(`Error al eliminar carrito con id ${cid}: `, error.message)
        }
    }

    async deleteProducts(cid){
        try {
            await Cart.updateOne({ _id: cid }, { $set: { products: [] } })
        } catch (error) {
            console.error(`Error al eliminar todos los productos del carrito con id ${cid}: `, error.message)
            throw new Error(`Error al eliminar todos los productos del carrito con id ${cid}: `, error.message)
        }
    }

    async insertMany(carts){
        try {
            return await Cart.insertMany(carts)
        } catch(error){
            console.error('Error al agregar varios carritos: ', error.message)
            throw new Error('Error al agregar varios carritos: ', error.message)
        }
    }
}

module.exports = CartDao