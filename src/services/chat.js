let activeUsers = [];
const messages = [];

class ChatService {
  constructor(io) {
    this.io = io;

    io.on("connection", socket => {
      console.log("A wild client has appeared!:", socket.id);

      socket.on("active", username => {
        const alreadyThere = activeUsers.filter(activeUser => activeUser.username === username && activeUser.idSocket === socket.id).length !== 0;
        if(alreadyThere) {return;}
        activeUsers.push({
          username,
          idSocket:socket.id
        });
        socket.username = username;
        socket.isAuthenticated = true;

        io.emit("userConnected", activeUsers);
      });

      socket.on("disconnect", () => {
        activeUsers = activeUsers.filter(activeUser => activeUser.idSocket !== socket.id);
        io.emit("userDisconnected", activeUsers);
        console.log("Someone has disconnected");
      });

      socket.on("sendMessage", messageContent => {
        if(!socket.isAuthenticated) {
          console.log("Not Authenticated yet!");
          return;
        }
        messages.push({
          username: socket.username,
          content: messageContent
        });
        io.emit("messageReceived", messages);
      });
    });
  }
}

module.exports = ChatService;