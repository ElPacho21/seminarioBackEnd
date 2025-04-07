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
            const consults = await Consult.find({product: pid}).sort({date: -1})
            console.log("consults dao: ", consults)
            return consults
        } catch(error){
            console.error('Error al obtener consultas por producto:', error.message)
            throw new Error('Error al obtener consultas por producto:', error.message)
        }
    }

    async findFirstConsults(pid){
        try {
            console.log("Pid: ", pid)
            const consults = await Consult.find({product: pid})
            console.log("consultas first: ", consults)
            return consults

        } catch(error){
            console.error('Error al obtener consultas por producto:', error.message)
            throw new Error('Error al obtener consultas por producto:', error.message)
        }
    }

    async answerConsult(cid, answer){
        try {
            const consult = await Consult.findByIdAndUpdate(cid, {answer})
            return consult
        } catch (error) {
            console.error('Error al responder consulta:', error.message)
            throw new Error('Error al responder consulta:', error.message)
        }
    }
}

module.exports = ConsultDao