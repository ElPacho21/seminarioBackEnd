const CustomRouter = require('../classes/CustomRouter');
const { frontEndUrl } = require('../config/app.config');
const { generateToken } = require('../utils/jwt.util');
const passportCall = require('../utils/passportCall.util');

class GoogleController extends CustomRouter {

    init() {

        this.get('/', ['PUBLIC'], passportCall('google', {scope: ['profile', 'email']}), async (req, res) => {
        })

        this.get('/googleCallback', ['PUBLIC'], passportCall('google'), async (req, res) => {
            if (!req.user) {
                return res.status(401).json({ status: 'error', message: 'No se pudo autenticar con Google' });
            }
        
            
            const accessToken = generateToken({
                id: req.user._id,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                role: req.user.role,
                nickName: req.user.nickName || '',
                cartId: req.user.cart || null
            });
        
            res.cookie('authToken', accessToken, {
                maxAge: 60 * 60 * 1000,
                httpOnly: true
            });
        
            res.redirect(`${frontEndUrl}/products`);
        });
        
    }
}

module.exports = GoogleController