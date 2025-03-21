const UserDao = require('../dao/mongoDb/Users.dao');
const CustomRouter = require('../classes/CustomRouter');
const { generateToken } = require('../utils/jwt.util');
const ChatDao = require('../dao/mongoDb/Chat.dao');

const userDao = new UserDao();
const chatDao = new ChatDao();
class UsersController extends CustomRouter {
    init() {
        this.post('/', ['PUBLIC'], async (req, res) => {
            try {
                const { firstName, lastName, age, email, nickName, password } = req.body;
                const newUserInfo = {
                    firstName,
                    lastName,
                    age,
                    email,
                    nickName,
                    password
                }
        
                const user = await userDao.insertOne(newUserInfo)
                
                res.status(201).json({ status: 'success', payload: user});
            } catch (error) {
                console.error(error.message)
                res.status(500).json({ status: 'error', payload: 'Server Internal error' });
            }
        })

        this.patch('/', ['CLIENT', 'ADMIN'], async (req, res) => {
            try {
                const { userId, firstName, lastName, email, nickName } = req.body;
                const userInfo = { firstName, lastName, email, nickName };
        
                const user = await userDao.updateById(userId, userInfo);
                if (!user) {
                    //return res.status(404).json({ status: 'error', message: 'User not found' });
                }
        
                const newToken = generateToken({ 
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    nickName: user.nickName,
                    role: user.role
                });
        
                res.cookie("authToken", newToken, {maxAge: 60 * 60 * 1000, httpOnly: true, secure: true, sameSite: "None"});
                    
                res.status(200).json({ status: 'success', payload: user });
            } catch (error) {
                console.error(error.message);
                res.status(500).json({ status: 'error', payload: 'Server Internal error' });
            }
        });
        
        this.get('/:uid/chat', ['CLIENT', 'ADMIN'], async (req, res) => {
            try {
                const chat = await chatDao.findByUserId(req.params.uid)
                res.status(200).json({ status: 'success', payload: chat });
            } catch (error) {
                console.error(error.message);
                res.status(500).json({ status: 'error', payload: 'Server Internal error' });
            }
        })

    }
}

module.exports = UsersController