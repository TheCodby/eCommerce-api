const Product = require("../models/Product");

exports.getProduct = async (req, res, next) => {
  Product.findById(req.params.productId, function (err, doc) {
    if (err || !doc) {
      res
        .json({
          error: "Not Found",
        })
        .status(404);
    } else {
      res.json(doc).status(200);
    }
  });
};
