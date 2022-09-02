const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const CartSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  cost: {
    type: Number,
    default: 0,
  },
});
CartSchema.methods.findProducts = function (cb) {
  return this.model("CartItem")
    .aggregate([
      { $match: { cart_id: ObjectId(this._id) } },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "product",
        },
      },
    ])
    .exec(cb);
};
CartSchema.methods.getCost = async function (cb) {
  const data = await this.model("CartItem").find({
    cart_id: ObjectId(this._id),
  });
  const totalCost = data.reduce((sum, item) => {
    return sum + item.cost;
  }, 0);
  return totalCost;
};
const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;
