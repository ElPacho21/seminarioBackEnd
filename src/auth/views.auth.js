const CustomRouter = require('../classes/CustomRouter');

class AuthView extends CustomRouter {
    init() {
        this.get('/profile', ['USER', 'ADMIN'], (req, res) => {
            const user = req.user
            res.render('profile.handlebars', { user });
        })
        
        this.get('/signup', ['PUBLIC'], (req, res) => {
            res.render('signup.handlebars');
        })
        
        this.get('/login', ['PUBLIC'], (req, res) => {
            res.render('login.handlebars');
        })
        
        this.get('/failRegister', ['PUBLIC'], (req, res) => {
            res.render('failRegister.handlebars');
        })
        
        this.get('/failLogin', ['PUBLIC'], (req, res) => {
            res.render('failLogin.handlebars');
        })
    }
}

module.exports = AuthView