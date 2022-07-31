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
  isFile: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {timestamps: true});

const chatSchema = new mongoose.Schema({
  userOne: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  userTwo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  messages: [messageSchema]
}, {timestamps:true});

const ChatModel = mongoose.model("chat", chatSchema);

module.exports = ChatModel;