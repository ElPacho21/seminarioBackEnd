const CustomRouter = require('../classes/CustomRouter');
const ChatDao = require('../dao/mongoDb/Chat.dao');

const chatDao = new ChatDao()

class ChatController extends CustomRouter {
    init() {
        this.post('/', ['CLIENT', 'ADMIN'], async (req, res) => {
            try {
                const { admin, client } = req.body;
                const newChat = await chatDao.insertOne({ admin, client });
                res.status(201).json({ status: 'success', payload: newChat });
            } catch (error) {
                console.error(error.message);
                res.status(500).json({ status: 'error', payload: 'Server Internal error' });
            }
        })

        //Rutas pubicas para testear
        this.post('/public', ['PUBLIC'], async (req, res) => {
            try {
                const { client } = req.body;
                const newChat = await chatDao.insertOne({ client });
                res.status(201).json({ status: 'success', payload: newChat });
            } catch (error) {
                console.error(error.message);
                res.status(500).json({ status: 'error', payload: 'Server Internal error' });
            }
        })

        this.get('/public', ['PUBLIC'], async (req, res) => {
            try {
                const chats = await chatDao.findByUserId("67d054c6da2eb54bfbde5eed");
                res.status(201).json({ status: 'success', payload: chats });
            } catch (error) {
                console.error(error.message);
                res.status(500).json({ status: 'error', payload: 'Server Internal error' });
            }
        })
    }
}

module.exports = ChatController;