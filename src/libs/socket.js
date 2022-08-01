const socketio = require("socket.io");

function connection(server) {
  const io = socketio(server, {
    cors: {
      origin: ["http://127.0.0.1:5500", "https://messenger-boy.vercel.app"],
      methods: ["GET", "POST"],
      credentials: true
    },
    cookie: true
  });

  console.log("Socket is ready to take our messages");
  return io;
}

module.exports = connection;