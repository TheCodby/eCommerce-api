const express = require("express");
const { signup, login, generateNewToken } = require("../controllers/auth");
const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/generate-token", generateNewToken);

module.exports = authRouter;
