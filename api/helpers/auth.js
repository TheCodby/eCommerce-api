const jwt = require("jsonwebtoken");
require("dotenv").config();

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function generateString(length) {
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

exports.generateRefreshToken = async () => {
  const refreshToken = generateString(64);
  return refreshToken;
};

exports.getUserByToken = async (token) => {
  var decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  return decoded;
};
