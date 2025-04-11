const CustomRouter = require('../classes/CustomRouter');
const { hashPassword } = require('../utils/bcrypt.util');
const { generateToken, verifyToken } = require('../utils/jwt.util');
const passportCall = require('../utils/passportCall.util');

class AuthController extends CustomRouter {

    init() {
        this.post('/signup', ['PUBLIC'], passportCall('register', { failureRedirect: '/api/failRegister' }), async (req, res) => {
            try {
                res.status(201).json({ status: 'success', payload: 'Usuario registrado', redirectUrl: '/api/login'});
            } catch (error) {
                console.error(error.message)
                res.status(500).json({ status: 'error', payload: 'Server Internal error' });
            }
        })
        
        this.post('/login', ['PUBLIC'], passportCall('login', { failureRedirect: '/api/failLogin' }), async (req, res) => {
            try {

                console.log("/login")
                if(!req.user) return res.status(401).json({ status: 'success', redirectUrl: '/api/failLogin' })
        
                const accessToken = generateToken({ 
                    id: req.user._id,
                    firstName: req.user.firstName,
                    lastName: req.user.lastName,
                    email: req.user.email,
                    role: req.user.role,
                    nickName: req.user.nickName,
                    cartId: req.user.cart || null 
                })
                
                res.cookie('authToken', accessToken, {maxAge: 60 * 60 * 1000, httpOnly: true, secure: true, sameSite: "None"}).json({
                    status: 'success', payload: req.user, redirectUrl: '/api/viewsproducts'
                })
        
            } catch (error) {
                console.error(error.message)
                res.status(500).json({ status: 'error', payload: 'Internal server error' });
            }
        })
        
        this.get('/logout', ['CLIENT', 'ADMIN'], (req, res) => {
            try {
                res.clearCookie('authToken')
                res.redirect('/api/login')
            } catch (error) {
                res.status(500).json({ error: error.message, payload: 'Server Internal error' });
            }
        })
        
        this.get('/github', ['PUBLIC'], passportCall('github', {scope: ['user: email']}), async (req, res) => {
            const accessToken = generateToken({ 
                id: req.user._id,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                role: req.user.role,
                nickName: req.user.nickName,
                cartId: req.user.cart || null 
            })
            res.cookie('authToken', accessToken, {maxAge: 60 * 60 * 1000, httpOnly: true}).json({
                status: 'success', payload: req.user
            })
        })
        
        this.get('/githubCallback', ['PUBLIC'], 
            passportCall('github', { failureRedirect: '/api/login' }),
            async (req, res) => {
                res.redirect('/api/viewsproducts')
            })
        
        this.patch('/forgotPassword', ['PUBLIC'], async (req, res) => {
            try {
             const { email, password } = req.body
             const passwordEncrypted = hashPassword(password)
             await User.updateOne({email}, {password: passwordEncrypted })
             res.json({ message: 'Password updated' });
            } catch (error) {
             res.json({ error: error.message });
            }
        })

        this.get('/current', ['CLIENT', 'ADMIN'], (req, res) => {
            const token = req.cookies.authToken;
            if (!token) {
                return res.status(401).json({ error: 'Invalid token' });
            }
            try {
                const user = verifyToken(token);
                res.json(user);
            } catch (error) {
                return res.status(401).json({ error: 'Invalid token' });
            }
        });

        this.get('/me', ['CLIENT', 'ADMIN'], (req, res) => {
            const token = req.cookies.authToken;
            try {
                return res.status(200).json(token)
            } catch (error) {
                return res.status(401).json({ error: 'Invalid token' });
            }
        });
        
    }
}

module.exports = AuthController