const express = require("express");
const { getProduct } = require("../controllers/product");

const productRouter = express.Router();

productRouter.get("/:productId", getProduct);

module.exports = productRouter;
