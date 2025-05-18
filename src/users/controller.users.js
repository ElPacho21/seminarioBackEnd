const fs = require('fs');
const path = require('path');

const UserDao = require('../dao/mongoDb/Users.dao');
const CustomRouter = require('../classes/CustomRouter');
const { generateToken } = require('../utils/jwt.util');
const createUploader = require('../utils/multer.util');
const ChatDao = require('../dao/mongoDb/Chat.dao');
const optimizeImages = require('../utils/sharp.util');

const userDao = new UserDao();
const chatDao = new ChatDao();

const uploaderUsers = createUploader('users');
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

        this.put('/avatar/:uid', ['CLIENT', 'ADMIN'], uploaderUsers.single('avatar'), async (req, res) => {
            try {
                const { uid } = req.params;

                if (!req.file) {
                   return res.status(400).json({ error: 'No se subió ninguna imagen' });
                }

                const user = await userDao.findById(uid);
                if (!user) {
                    return res.status(404).json({ error: 'Usuario no encontrado' });
                }

                const avatar = await optimizeImages(req.file, { forceSquare: true });
                
                //Eliminar el avatar anterior
                if (user.avatar && user.avatar !== 'default-avatar.webp') {
                    const previousAvatarPath = path.join(process.cwd(), 'src', 'public', 'images', 'users', user.avatar);

                    try {
                        await fs.promises.unlink(previousAvatarPath);
                        console.log(`Avatar anterior ${user.avatar} eliminado`);
                    } catch (err) {
                        console.warn(`No se pudo borrar el avatar anterior (${user.avatar}):`, err.message);
                    }
                }

                await userDao.updateById(uid, { avatar });
                res.status(200).json({ status: 'success', payload: avatar });
            } catch (error) {
                console.error(error.message);

                if (error.code === 'LIMIT_FILE_SIZE') {
                   return res.status(400).json({ error: 'El archivo es demasiado grande. Máximo 2 MB.' });
                }

                if (error.message.includes('Tipo de archivo no permitido')) {
                    return res.status(400).json({ status: 'error', message: error.message });
                }

                res.status(500).json({ status: 'error', payload: 'Server Internal error' });
            }
        })
    }
}

module.exports = UsersController