const { default: mongoose } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const categorySchema = mongoose.Schema({
  name: { type: String, required: true },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});
categorySchema.plugin(mongoosePaginate);
categorySchema.pre("remove", function (next) {
  this.model("Product").remove({ category: this._id }, next);
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
