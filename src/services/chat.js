let activeUsers = [];
const messages = [];
const ChatModel = require("../models/chat");
const cookie = require("cookie");
const AuthService = require("./auth");

class ChatService {
  constructor(io) {
    this.io = io;

    io.on("connection", socket => {
      // console.log("A wild client has appeared!:", socket.id);

      socket.on("userConnected", () => {
        const cookies = socket.handshake.headers.cookie;
        if(!cookies) {
          console.log("No Cookies provided");
          return;
        }

        const {token} = cookie.parse(cookies);
        if(!token) {
          console.log("No Token provided");
          return;
        }

        const user = AuthService.validate(token);
        activeUsers.push({
          idUser: user.id,
          idSocket: socket.id
        });
        socket.idUser = user.id;

        io.emit("userConnected", activeUsers);
      });

      socket.on("disconnect", () => {
        console.log("Someone has disconnected");
        activeUsers = activeUsers.filter(activeUser => activeUser.idSocket !== socket.id);
        io.emit("userDisconnected", activeUsers);
      });

      socket.on("beginChat", async idChat => {
        socket.idChat = idChat;
        const messages = await ChatModel.findById(idChat);
        io.to(socket.id).emit("messages", messages);
      });

      socket.on("sendMessage", async content => {
        const chat = await this.sendMessage(socket.idChat, socket.idUser, content);

        const {idUserOne, idUserTwo} = chat;
        const receiverID = socket.idUser === idUserOne ? idUserTwo.toString() : idUserOne.toString();
        const receiverConnected = activeUsers.find(activeUser => activeUser.idUser === receiverID);

        if(receiverConnected) {
          socket.to(receiverConnected.idSocket).emit("messageReceived", {
            senderID: socket.idUser,
            content
          });
        }
        io.to(socket.id).emit("messageSended", chat);
      });
    });
  }
}

module.exports = ChatService;