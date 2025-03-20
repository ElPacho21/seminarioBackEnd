const Chat = require('../models/Chat.model')

class ChatDao {
    constructor() {

    }

    async findById(cid){
        try {
            const chat = await Chat.findById(cid)
            return chat
        } catch (error) {
            console.error('Error al buscar chat:', error.message)
            return null
        }
    }

    async findByUserId(uid){
        try {
            const chats = await Chat.find({ client: uid })
            return chats
        } catch (error) {
            console.error('Error al buscar chats por usuario:', error.message)
            return null
        }
    }

    async insertOne(chat){
        try {
            const newChat = await Chat.create(chat)
            return newChat
        } catch (error) {
            console.error('Error al agregar chat:', error.message)
            throw new Error('Error al agregar chat:', error.message)
        }
    }
    
}

module.exports = ChatDao