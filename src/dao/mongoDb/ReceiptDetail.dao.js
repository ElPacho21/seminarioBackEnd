const ReceiptDetail = require('../models/ReceiptDetail.model')

class ReceiptDetailDao {
    constructor() {

    }

    async findAll() {
        try {
            return await ReceiptDetail.find()
        } catch (error) {
            console.error('Error al obtener detalles de recibo: ', error.message)    
            throw new Error('Error al obtener detalles de recibo: ', error.message)    
        }
    }


    async findById(id) {
        try {
            return await ReceiptDetail.findOne({ _id: id })
        } catch (error) {
            console.error(`Error al obtener detalle de recibo con id ${id}:`, error.message)
            throw new Error(`Error al obtener detalle de recibo con id ${id}:`, error.message)
        }
    }

    async insertReceiptDetail(receiptDetail) {
        try {
            const newReceiptDetail = await ReceiptDetail.create(receiptDetail)
            return newReceiptDetail
        } catch (error) {
            console.error('Error al crear detalle de recibo: ', error.message)
            throw new Error('Error al crear detalle de recibo: ', error.message)
        }
    }

}

module.exports = ReceiptDetailDao