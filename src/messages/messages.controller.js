const CustomRouter = require('../classes/CustomRouter');
const ChatDao = require('../dao/mongoDb/Chat.dao');
const MessageDao = require('../dao/mongoDb/Messages.dao');
const UserDao = require('../dao/mongoDb/Users.dao');

const messageDao = new MessageDao()
const userDao = new UserDao()
const chatDao = new ChatDao()

class MessagesController extends CustomRouter {
    init() {
        this.get('/', ['ADMIN', 'CLIENT'], async (req, res) => {
            try {
                const messages = await messageDao.findAll()
                res.status(200).json({ status:'success', messages });
            } catch (error) {
                console.error('Error al obtener los mensajes:', error.message);
                res.status(500).json({ message: 'Error al obtener los mensajes' });
            }
        })
        this.get('/user/:uid', ['CLIENT', 'ADMIN'], async (req, res) => {
            try {
                const { uid } = req.params;
                const chat = await chatDao.findByUserId(uid)
                const messages = await messageDao.find({chat: chat._id})
                res.status(200).json({ status:'success', messages });
            } catch (error) {
                console.error('Error al obtener los mensajes:', error.message);
                res.status(500).json({ message: 'Error al obtener los mensajes' });
            }
        })

        //Ruta publica para testear
        this.get('/public', ['PUBLIC'], async (req, res) => {
            try {
                const messages = await messageDao.findAll()
                res.status(200).json({ status:'success', messages });
            } catch (error) {
                console.error('Error al obtener los mensajes:', error.message);
                res.status(500).json({ message: 'Error al obtener los mensajes' });
            }
        })

        this.get('/public/user/:uid', ['PUBLIC'], async (req, res) => {
            try {
                const { uid } = req.params;
                const [chat] = await chatDao.findByUserId(uid)
                console.log("Chat: ", chat)
                const messages = await messageDao.findByChatId(chat._id)
                res.status(200).json({ status:'success', messages });
            } catch (error) {
                console.error('Error al obtener los mensajes:', error.message);
                res.status(500).json({ message: 'Error al obtener los mensajes' });
            }
        })

        this.post('/public', ['PUBLIC'], async (req, res) => {
            try {
                const { user, message, chat } = req.body;
                const newMessage = await messageDao.insertOne({user, message, chat, date: Date.now()})
                console.log("New message: ", newMessage)
                const messages = await messageDao.findByChatId(chat)
                res.status(200).json({ status:'success', messages });
            } catch (error) {
                console.error('Error al obtener los mensajes:', error.message);
                res.status(500).json({ message: 'Error al obtener los mensajes' });
            }
        })
    }
}

module.exports = MessagesController;