const Category = require("../models/Category");
const Product = require("../models/Product");
exports.createCategory = (req, res, next) => {
  new Category({
    name: req.body.name,
  })
    .save()
    .then((result) => {
      res.json(result).status(201);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
exports.deleteCategory = (req, res, next) => {
  Category.findById(req.params.categoryId, async (err, category) => {
    if (category && !err) {
      await category.remove();
      res
        .json({
          message: `Successfully deleted category ${category.name}`,
        })
        .status(201);
    } else {
      res
        .json({
          message: `This category doesn't exist`,
        })
        .status(404);
    }
  });
};

// product
exports.createProduct = (req, res, next) => {
  new Product({
    name: req.body.name,
    price: req.body.price,
    quantity: req.body.quantity,
    category: req.body.category_id,
    image: req.body.image,
  })
    .save()
    .then(async (result) => {
      const categoryRelated = await Category.findById(req.body.category_id);
      // push the comment into the post.comments array
      categoryRelated.products.push(result);
      // save and redirect...
      await categoryRelated.save(function (err) {
        if (err) {
          console.log(err);
          return;
        }
        res.json(result).status(201);
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
};
exports.deleteProduct = (req, res, next) => {
  Product.findById(req.params.productId, async (err, product) => {
    if (product && !err) {
      await product.remove();
      res
        .json({
          message: `Successfully deleted product ${product.name}`,
        })
        .status(201);
    } else {
      res
        .json({
          message: `This product doesn't exist`,
        })
        .status(404);
    }
  });
};
