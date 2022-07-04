const mongoose = require("mongoose");
const {
  dbUsername,
  dbPassword,
  dbHost,
  dbName
} = require(".");

async function connection() {
  const conn = await mongoose.connect(`mongodb+srv://${dbUsername}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority`);
  console.log("MongoDB connected:", conn.connection.host);
}

module.exports = {connection, mongoose};