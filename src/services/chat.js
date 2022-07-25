let activeUsers = [];
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
        socket.userName = user.name;
        socket.userProfilePic = user.profilePic;

        io.emit("userConnected", activeUsers);
      });

      socket.on("disconnect", async () => {
        // Deleting Empty Chats
        await this.deleteEmptyChats(socket.idUser);

        // Deleting Current User from ActiveUsers
        activeUsers = activeUsers.filter(activeUser => activeUser.idSocket !== socket.id);
        io.emit("userDisconnected", activeUsers);
      });

      socket.on("beginChat", async idChat => {
        socket.idChat = idChat;
        const messages = await ChatModel.findById(idChat);
        io.to(socket.id).emit("messages", messages);
      });

      socket.on("sendMessage", async (content, isFile) => {
        const chat = await this.sendMessage(socket.idChat, socket.idUser, content, isFile);

        const {userOne, userTwo} = chat;
        const receiverID = socket.idUser === userOne.toString() ? userTwo.toString() : userOne.toString();
        const receiverConnected = activeUsers.find(activeUser => activeUser.idUser === receiverID);

        if(receiverConnected) {
          io.to(receiverConnected.idSocket).emit("messageReceived", {
            senderID: socket.idUser,
            senderName: socket.userName,
            senderProfilePic: socket.userProfilePic,
            chat,
            content
          });
        }
        io.to(socket.id).emit("messageSended", chat);
      });

      socket.on("readChat", async idChat => {
        await this.makeChatAsReaded(idChat);
        io.to(socket.id).emit("readChat");
      });
    });
  }

  async deleteEmptyChats(idUser) {
    await ChatModel.deleteMany({
      $or: [
        {userOne: idUser},
        {userTwo: idUser}
      ],
      messages: []
    });
  }

  async makeChatAsReaded(idChat) {
    const chat = await ChatModel.findById(idChat);
    if(chat.messages.length !== 0) {
      chat.messages[chat.messages.length - 1].read = true;
    }
    chat.save();
  }

  async getMyChats(idUser) {
    const chats = await ChatModel.find({
      $or:[
        {userOne:idUser},
        {userTwo:idUser}
      ]
    }).sort({updatedAt:-1}).populate("userOne", "name profilePic").populate("userTwo", "name profilePic");
    return chats;
  }

  async getOrCreate(idUserOne, idUserTwo) {
    const chatAlreadyThere = await ChatModel.findOne({
      $or: [
        {
          userOne: idUserOne,
          userTwo: idUserTwo
        }, {
          userOne: idUserTwo,
          userTwo: idUserOne
        }
      ]
    }).populate("userOne", "name profilePic").populate("userTwo", "name profilePic");

    if(!chatAlreadyThere) {
      const chatCreated = await ChatModel.create({
        userOne: idUserOne,
        userTwo: idUserTwo
      });
      return await ChatModel.findById(chatCreated.id).populate("userOne", "name profilePic").populate("userTwo", "name profilePic");
    }
    return chatAlreadyThere;
  }

  async sendMessage(idChat, idSender, content, isFile) {
    const chat = await ChatModel.findByIdAndUpdate(idChat, {
      $push: {
        messages: {
          idSender,
          content,
          isFile
        }
      }
    }, {new:true});
    return chat;
  }
}

module.exports = ChatService;