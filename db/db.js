require("dotenv").config();
const mongoose = require("mongoose");
const db = mongoose.connection;
const url = process.env.MONGO_URL;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log(`Connected to ${url}`);
});
module.exports = {
  connectToServer: async (callback) => {
    mongoose.connect(url);
  },
};
