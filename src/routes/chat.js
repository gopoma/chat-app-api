const express = require("express");
const socketConnection = require("../libs/socket");
const ChatService = require("../services/chat");
const authValidation = require("../middleware/auth");

function chat(server, app) {
  const router = express.Router();
  const io = socketConnection(server);
  const chatService = new ChatService(io);

  app.use("/api/chats", router);

  router.get("/", authValidation(1), async (req, res) => {
    const idUser = req.user.id;
    const result = await chatService.getMyChats(idUser);
    return res.json(result);
  });

  router.post("/:idUser", authValidation(1), async (req, res) => {
    const idUserOne = req.user.id;
    const idUserTwo = req.params.idUser;

    const result = await chatService.create(idUserOne, idUserTwo);
    return res.json(result);
  });
}

module.exports = chat;