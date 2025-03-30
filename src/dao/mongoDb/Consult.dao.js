const Consult = require('../models/Consult.model')

class ConsultDao {
    constructor() {

    }

    async insertOne(consult){
        try {
            const newConsult = await Consult.create(consult)
            return newConsult
        } catch(error){
            console.error('Error al agregar consulta:', error.message)
            throw new Error('Error al agregar consulta:', error.message)
        }
    }

    async findByProduct(pid){
        try {
            return await Consult.find({product: pid}).sort({date: -1})
        } catch(error){
            console.error('Error al obtener consultas por producto:', error.message)
            throw new Error('Error al obtener consultas por producto:', error.message)
        }
    }

    async findFirstConsults(pid){
        try {
            return await Consult.find({product: pid}).sort({date: -1}).limit(2)
        } catch(error){
            console.error('Error al obtener consultas por producto:', error.message)
            throw new Error('Error al obtener consultas por producto:', error.message)
        }
    }
}

module.exports = ConsultDao