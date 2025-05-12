const { Server } = require('socket.io');
const MessageDao = require('../dao/mongoDb/Messages.dao');
const ConsultDao = require('../dao/mongoDb/Consult.dao');
const { frontEndUrl } = require('../config/app.config');
const ChatDao = require('../dao/mongoDb/Chat.dao');

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
    console.log(`Cliente conectado ${socket.id}`);
    const Message = new MessageDao();
    const Consult = new ConsultDao();
    const Chat = new ChatDao();

    const getAdminMappedChats = async (adminID) => {
      const chats = await Chat.findByAdminId(adminID);
      const mappedChats = await Promise.all(
        chats.map(async (chat) => {
          const messages = await Message.findByChatId(chat._id);
          return {
            clientNickName: chat.client.nickName,
            chatID: chat._id,
            messages
          };
        })
      );
      return mappedChats;
    };

    const getClientMappedChats = async (userID) => {
      let chats = await Chat.findByUserId(userID);
      if(!chats.length){
        await Chat.insertOne({ client: userID });
        chats = await Chat.findByUserId(userID);
      }
      const mappedChats = await Promise.all(
        chats.map(async (chat) => {
          const messages = await Message.findByChatId(chat._id);
          return {
            clientNickName: "admin",
            chatID: chat._id,
            messages
          };
        })
      );
      return mappedChats;
    };

    // Chat messages

    socket.on('newUser', async (userID) => {
      try {
        socket.join(userID); // se une a una sala con su userID
        console.log("Usuario se une a sala:", userID);
        const mappedChats = await getClientMappedChats(userID);
        socket.emit('clientChatsLogs', { mappedChats });
      } catch (error) {
        console.error(error.message);
      }
    });

    socket.on("newAdmin", async (adminID) => {
      try {
        socket.join(adminID); // todos los admins comparten esta sala
        const mappedChats = await getAdminMappedChats(adminID);
        socket.emit('adminChatsLogs', { mappedChats });
      } catch (error) {
        console.error(error.message);
      }
    });

    socket.on('newAdminMessage', async (data) => {
      try {
        const { chatID, message } = data;
        const chat = await Chat.findById(chatID);
        const newMessage = {
          chat: chatID,
          user: chat.admin,
          message,
          date: new Date()
        };
        await Message.insertOne(newMessage);
        const adminMappedChats = await getAdminMappedChats(chat.admin);
        const clientMappedChats = await getClientMappedChats(chat.client);

        io.to(chat.admin.toString()).emit('adminChatsLogs', { mappedChats: adminMappedChats });
        io.to(chat.client.toString()).emit("clientChatsLogs", { mappedChats: clientMappedChats });
      } catch (error) {
        console.error(error.message);
      }
    });

    socket.on('newClientMessage', async (data) => {
      try {
        const { chatID, message } = data;
        const chat = await Chat.findById(chatID);
        const newMessage = {
          chat: chatID,
          user: chat.client,
          message,
          date: new Date()
        };
        await Message.insertOne(newMessage);
        const adminMappedChats = await getAdminMappedChats(chat.admin);
        const clientMappedChats = await getClientMappedChats(chat.client);

        io.to(chat.admin.toString()).emit('adminChatsLogs', { mappedChats: adminMappedChats });
        io.to(chat.client.toString()).emit("clientChatsLogs", { mappedChats: clientMappedChats });
      } catch (error) {
        console.error(error.message);
      }
    });

    // Consultas de productos

    socket.on('newConsult', async (data) => {
      try {
        const { consult, pid } = data;
        const newConsult = { question: consult, date: new Date(), product: pid };
        await Consult.insertOne(newConsult);
        const consults = await Consult.findByProduct(pid);
        io.emit('consults', consults);
      } catch (error) {
        console.error(error.message);
      }
    });

    socket.on("consultsLogs", async (data) => {
      try {
        const { pid } = data;
        const consults = await Consult.findByProduct(pid);
        socket.emit("consults", consults);
      } catch (error) {
        console.error("Error en consultsLogs:", error.message);
      }
    });

    socket.on("answerQuery", async (data) => {
      try {
        const { pid, cid, answer } = data;
        await Consult.answerConsult(cid, answer);
        const consults = await Consult.findByProduct(pid);
        socket.emit("consults", consults);
      } catch (error) {
        console.error("Error en answerQuery:", error.message);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Cliente desconectado ${socket.id}`);
    });
  });
};

const getIo = () => io;

module.exports = { socketio, getIo };
