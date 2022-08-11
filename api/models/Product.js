const { default: mongoose } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  price: { type: Number, min: 0 },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
});

productSchema.plugin(mongoosePaginate);
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
