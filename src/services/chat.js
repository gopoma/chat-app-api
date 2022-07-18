let activeUsers = [];
const messages = [];
const cookie = require("cookie");
const AuthService = require("./auth");

class ChatService {
  constructor(io) {
    this.io = io;

    io.on("connection", socket => {
      // console.log("A wild client has appeared!:", socket.id);

      socket.on("userConnected", () => {
        const cookies = socket.handshake.headers.cookie;
        const {token} = cookie.parse(cookies);

        if(!token) {return;}

        const user = AuthService.validate(token);
        console.log(user);
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

      socket.on("sendMessage", (receptorSocketId, message) => {
        console.log("Sending message...");
        socket.to(receptorSocketId).emit("messageReceived", {
          senderSocketId: socket.id,
          senderId: socket.idUser,
          message
        });
        io.to(socket.id).emit("messageSended", {
          senderSocketId: socket.id,
          senderId: socket.idUser,
          message
        });
      });
    });
  }
}

module.exports = ChatService;