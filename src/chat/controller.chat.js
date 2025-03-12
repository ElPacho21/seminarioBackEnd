const CustomRouter = require('../classes/CustomRouter');

class ChatController extends CustomRouter {
    init() {
        this.get('/', ['USER', 'ADMIN'], (req, res) => {
            res.render('chat.handlebars', {});
        })
        
        this.get('/user', ['USER', 'ADMIN'], (req, res) => {
            const nickName = req.user.nickName
            res.json({ nickName })
        })
    }
}

module.exports = ChatController;    