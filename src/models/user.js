const {mongoose} = require("../config/db");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: [3, "No less than 3 characters"],
    maxlength: [100, "No greater than 100 characters"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    trim: true,
    unique: [true, "Email already registered"],
    // eslint-disable-next-line
    match: [/^[\w\.-]+@[\w]+\.[\.\w]+$/, "Invalid Email"]
  },
  password: {
    type: String,
    required: [true, "Please provide password"]
  },
  location: {
    state: String,
    city: String,
    district: String
  },
  role: {
    type: Number,
    default: 1
  },
  profilePic: String,
  provider: {
    local: Boolean,
    facebook: Boolean,
    google: Boolean,
    twitter: Boolean,
    github: Boolean
  },
  idProvider: {
    facebook: String,
    google: String,
    twitter: String,
    github: String
  }
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;