const { Server } = require('socket.io');
const ProductDao = require('../dao/mongoDb/Products.dao');
const MessageDao = require('../dao/mongoDb/Messages.dao');
const ProductManager = require('../dao/fileSystem/ProductManager');
const CartDao = require('../dao/mongoDb/Carts.dao');

const productManager = new ProductManager('products.json');

let io;
const socketio = (server) => {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true
        }
    });

io.on('connection', async (socket) => {
    console.log(`Cliente conectado ${socket.id}`)
    const Product = new ProductDao();
    const Message = new MessageDao();

    // Real Time Products

    socket.on('createProduct', async (product) => {
        try {
            await Product.insertOne(product);
            const products = await Product.findAll();
            io.emit('updateProducts', products);
        } catch (error) {
            console.error(error.message);  
        }
    })

    socket.on('deleteProduct', async (pid) => {
        try {
            const product = await Product.findById(pid);
            productManager.deleteImages(product.thumbnails);
            await Product.deleteById(pid);
            const products = await Product.findAll();
            io.emit('updateProducts', products);
        } catch (error) {
            console.error(error.message);
        }
    })

    // Chat messages

    socket.on('newUser', async (user) => {
        try {
            socket.broadcast.emit('userConnected', user);
            const messages = await Message.findAll();
            socket.emit('messageLogs', messages);
        } catch (error) {
            console.error(error.message);
        }
    })

    socket.on('message', async (data) => {
        try {
            const { user, message } = data;
            const newMessage = { nickName: user, message, date: new Date() };
            await Message.insertOne(newMessage);
            const messages = await Message.findAll();
            io.emit('messageLogs', messages);
        } catch (error) {
            console.error(error.message);
        }
    })

    socket.on('disconnect', () => {
        console.log(`Cliente desconectado ${socket.id}`)
    })
})
}

const getIo = () => io;

module.exports = { socketio, getIo };
