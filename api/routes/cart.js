const express = require("express");
const {
  getCart,
  addProduct,
  removeProduct,
  checkout,
  successCheckout,
} = require("../controllers/cart");
const { verifyUser } = require("../middlewares/verifyToken");

const cartRouter = express.Router();

cartRouter.get("/", verifyUser, getCart);
cartRouter.post("/", verifyUser, addProduct);
cartRouter.delete("/:productId", verifyUser, removeProduct);
cartRouter.get("/checkout", verifyUser, checkout);
cartRouter.get("/checkout/successed", successCheckout);
cartRouter.get("/checkout/failed", successCheckout);

module.exports = cartRouter;
