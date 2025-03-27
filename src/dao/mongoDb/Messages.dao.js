const Message = require('../models/Messages.model')

class MessageDao {
    constructor() {

    }
    async findAll() {
        try {
            return await Message.find()
        } catch(error){
            console.error('Error al obtener mensajes:', error.message)
            throw new Error('Error al obtener mensajes:', error.message)
        }
    }

    async findByChatId(cid) {
        try {
            return await Message.find({chat: cid})
        } catch(error){
            console.error('Error al obtener mensajes:', error.message)
            throw new Error('Error al obtener mensajes:', error.message)
        }
    }

    async findById(id){
        try {
            return await Message.findOne({_id: id})
        } catch(error){
            console.error(`Error al obtener mensaje con id ${id}:`, error.message)
            throw new Error(`Error al obtener mensaje con id ${id}:`, error.message)
        }
    }

    async insertOne(message, cid){
        try {
            const newMessage = await Message.create({...message, chat: cid})
            return newMessage
        } catch(error){
            console.error('Error al agregar mensaje:', error.message)
            throw new Error('Error al agregar mensaje:', error.message)
        }
    }

    async insertMany(messages){
        try {
            return await Message.insertMany(messages)
        } catch(error){
            console.error('Error al agregar varios mensajes:', error.message)
            throw new Error('Error al agregar varios mensajes:', error.message)
        }
    }

    async updateById(id, updatedMessage){
        try {
            return await Message.findByIdAndUpdate(id, updatedMessage)
        } catch(error){
            console.error(`Error al actualizar mensaje con id ${id}:`, error.message)
            throw new Error(`Error al actualizar mensaje con id ${id}:`, error.message)
        }
    }

    async deleteById(id){
        try {
            return await Message.deleteById(id)
        } catch(error){
            console.error(`Error al eliminar mensaje con id ${id}:`, error.message)
            throw new Error(`Error al eliminar mensaje con id ${id}:`, error.message)
        }
    }

    async deleteById(id){
        try {
            return await Message.deleteById(id)
        } catch(error){
            console.error(`Error al eliminar mensaje con id ${id}:`, error.message)
            throw new Error(`Error al eliminar mensaje con id ${id}:`, error.message)
        }
    }
}

module.exports = MessageDao