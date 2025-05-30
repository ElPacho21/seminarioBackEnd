const ProductsController = require('../products/controller.products')
const CartsController = require('../carts/controller.carts')
const ChatController = require('../chat/controller.chat')
const AuthController = require('../auth/controller.auth')
const UsersController = require('../users/controller.users')
const MessagesController = require('../messages/messages.controller')
const GoogleController = require('../auth/controller.google')
const ConsultController = require('../consult/controller.consult')
const CheckoutController = require('../checkout/controller.checkout')
const ReceiptsController = require('../receipts/controller.receipts')
const CategoryController = require('../category/controller.category')

const productsController = new ProductsController()
const cartsController = new CartsController()
const chatController = new ChatController()
const authController = new AuthController()
const usersController = new UsersController()
const messagesController = new MessagesController()
const googleController = new GoogleController()
const consultController = new ConsultController()
const checkoutController = new CheckoutController()
const receiptsController = new ReceiptsController()
const categoryController = new CategoryController()

const router = (app) => {
    app.use('/api/products', productsController.getRouter());
    app.use('/api/carts', cartsController.getRouter());
    app.use('/api/chat', chatController.getRouter());
    app.use('/api/auth', authController.getRouter());
    app.use('/api/users', usersController.getRouter());
    app.use('/api/messages', messagesController.getRouter());
    app.use('/', googleController.getRouter());
    app.use('/api/consults', consultController.getRouter());
    app.use('/api/checkout', checkoutController.getRouter());
    app.use('/api/receipts', receiptsController.getRouter());
    app.use('/api/category', categoryController.getRouter());

    app.use('*', (req, res) => {
        res.status(404).send({ message: 'Ooops Page not found' })
    })
}

module.exports = router;