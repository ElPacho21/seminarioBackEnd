const Receipt = require('../models/Receipt.model')

class ReceiptDao {
    constructor() {

    }

    async findAll() {
        try {
            return await Receipt.find()
        } catch (error) {
            console.error('Error al obtener recibos: ', error.message)    
            throw new Error('Error al obtener recibos: ', error.message)    
        }
    }


    async findById(id) {
        try {
            return await Receipt.findOne({ _id: id })
        } catch (error) {
            console.error(`Error al obtener el recibo con id ${id}:`, error.message)
            throw new Error(`Error al obtener el recibo con id ${id}:`, error.message)
        }
    }

    async insertReceipt(receipt) {
        try {
            const newReceipt = await Receipt.create(receipt)
            return newReceipt
        } catch (error) {
            console.error('Error al crear recibo: ', error.message)
            throw new Error('Error al crear recibo: ', error.message)
        }
    }

    async updateById(id, updatedReceipt) {
        try {
            return await Receipt.findByIdAndUpdate(id, updatedReceipt)
        } catch (error) {
            console.error(`Error al actualizar recibo con id ${id}:`, error.message)
            throw new Error(`Error al actualizar recibo con id ${id}:`, error.message)
        }
    }
}

module.exports = ReceiptDao