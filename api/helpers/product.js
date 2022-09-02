const { ObjectId } = require("mongodb");
const Product = require("../models/Product");

exports.getPrice = async (productId) => {
  const results = await Product.findOne({ _id: ObjectId(productId) }).select(
    "price"
  );
  return results.price;
};
