const express = require("express");
const session = require("express-session");
const morgan = require("morgan");
const cors = require("cors");
const cookies = require("cookie-parser");
const {port, sessionSecret} = require("./config");
const {connection} = require("./config/db");
const passport = require("passport");

// Importando routes:
const auth = require("./routes/auth");
const users = require("./routes/users");
const files = require("./routes/files");
const chat = require("./routes/chat");

// Importando Estrategias
const {
  useGoogleStrategy,
  useFacebookStrategy,
  useTwitterStrategy,
  useGitHubStrategy
} = require("./middleware/authProvider");

const app = express();
const server = app.listen(port, () => {
  console.log(`Listening on: http://localhost:${port}`);
});
connection();

// Utilizando middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cookies());
app.use(cors({
  origin:["http://127.0.0.1:5500", "https://messenger-boy.vercel.app"],
  credentials: true
}));
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false
})); // Redis
app.use(passport.initialize());
// Usando Estrategias
passport.use(useGoogleStrategy());
passport.use(useFacebookStrategy());
passport.use(useTwitterStrategy());
passport.use(useGitHubStrategy());

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Utilizando las rutas:
auth(app);
users(app);
files(app);
chat(server, app);

app.get("/", (req, res) => {
  return res.json({message:"chat-app-api"});
});