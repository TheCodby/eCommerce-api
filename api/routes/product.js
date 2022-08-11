const express = require("express");

const productRouter = express.Router();

productRouter.get("/", (req, res, next) => {
  res.json(req.body);
});

module.exports = productRouter;
