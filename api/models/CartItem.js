const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const CartItemSchema = mongoose.Schema({
  cart_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  cost: {
    type: Number,
    required: true,
    min: 1,
  },
});
CartItemSchema.post("init", function () {
  return this.model("Cart").findOneAndUpdate(
    { _id: ObjectId(this.cart_id) },
    { $inc: { cost: 10 } }
  );
});
const CartItem = mongoose.model("CartItem", CartItemSchema);

module.exports = CartItem;
