const UserDao = require('../dao/mongoDb/Users.dao');
const CustomRouter = require('../classes/CustomRouter');

const userDao = new UserDao();

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
                
                res.status(201).json({ status: 'success', message: user});
            } catch (error) {
                console.error(error.message)
                res.status(500).json({ status: 'error', message: 'Server Internal error' });
            }
        })

        this.patch('/', ['USER', 'ADMIN'], async (req, res) => {
            try {
                const { userId, firstName, lastName, email, nickName } = req.body;
                const userInfo = { firstName, lastName, email, nickName };
        
                const user = await userDao.updateById(userId, userInfo);
                if (!user) {
                    return res.status(404).json({ status: 'error', message: 'User not found' });
                }
        
                const newToken = generateToken({ 
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    nickName: user.nickName,
                    role: user.role
                });
        
                res.cookie("authToken", newToken, { httpOnly: true, secure: true, sameSite: "strict" });
        
                res.status(200).json({ status: 'success', message: 'User updated successfully' });
            } catch (error) {
                console.error(error.message);
                res.status(500).json({ status: 'error', message: 'Server Internal error' });
            }
        });
    }
}

module.exports = UsersController