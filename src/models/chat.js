const {mongoose} = require("../config/db");

const messageSchema = new mongoose.Schema({
  idSender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  content: String,
  read: {
    type: Boolean,
    default: false
  },
  isFile: Boolean
}, {timestamps: true});

const chatSchema = new mongoose.Schema({
  idUserOne: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  idUserTwo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  messages: [messageSchema]
});

const ChatModel = mongoose.model("message", chatSchema);

module.exports = ChatModel;