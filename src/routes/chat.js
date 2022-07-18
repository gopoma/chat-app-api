const socketConnection = require("../libs/socket");
const ChatService = require("../services/chat");

function chat(server) {
  const io = socketConnection(server);
  new ChatService(io);
}

module.exports = chat;