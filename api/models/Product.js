const { default: mongoose } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  price: { type: Number, min: 0 },
  image: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
});

productSchema.plugin(mongoosePaginate);
productSchema.pre("remove", function (next) {
  this.model("Category").findByIdAndUpdate(
    this.category,
    { $pull: { products: { $in: [this._id] } } },
    next
  );
});
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
