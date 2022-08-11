const { createHmac } = require("node:crypto");
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
  console.log(refreshToken);
  const hash = createHmac("sha256", process.env.SHA256_KEY)
    .update(refreshToken)
    .digest("hex");
  return { hash, refreshToken };
};

exports.checkRefreshToken = (token) => {};
