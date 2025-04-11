const { Server } = require('socket.io');
const MessageDao = require('../dao/mongoDb/Messages.dao');
const ConsultDao = require('../dao/mongoDb/Consult.dao');
const { frontEndUrl } = require('../config/app.config');


let io;
const socketio = (server) => {
    io = new Server(server, {
        cors: {
            origin: `${frontEndUrl}`,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true
        }
    });

io.on('connection', async (socket) => {
    console.log(`Cliente conectado ${socket.id}`)
    const Message = new MessageDao();
    const Consult = new ConsultDao();

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

    socket.on('newConsult', async (data) => {
        try {
            console.log("New consult: ", data)
            const { consult, pid } = data;
            const newConsult = { question: consult, date: new Date(), product: pid };
            await Consult.insertOne(newConsult);
            const consults = await Consult.findByProduct(pid);
            io.emit('consults', consults);
        } catch (error) {
            console.error(error.message);
        }
    })

    socket.on("consultsLogs", async (data) => {
        try {
            const { pid } = data;
            console.log("ID:", pid)
            const consults = await Consult.findByProduct(pid);
            console.log(consults)
            socket.emit("consults", consults);
        } catch (error) {
            console.error("Error en consultsLogs:", error.message);
        }
    })

    socket.on("answerQuery", async (data) => {
        try {
            const { pid, cid, answer } = data;
            await Consult.answerConsult(cid, answer)
            const consults = await Consult.findByProduct(pid);
            socket.emit("consults", consults);
        } catch (error) {
            console.error("Error en consultsLogs:", error.message);
        }
    })    

    socket.on('disconnect', () => {
        console.log(`Cliente desconectado ${socket.id}`)
    })
})
}

const getIo = () => io;

module.exports = { socketio, getIo };
