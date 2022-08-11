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
  Category.findById(req.params.catId, async (err, category) => {
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
  })
    .save()
    .then(async (result) => {
      console.log(req.body.category_id);
      const categoryRelated = await Category.findById(req.body.category_id);
      // push the comment into the post.comments array
      console.log(categoryRelated);
      categoryRelated.products.push(result);
      // save and redirect...
      await categoryRelated.save(function (err) {
        if (err) {
          console.log(err);
        }
        res.json(result).status(201);
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
exports.deleteProduct = (req, res, next) => {
  Product.findByIdAndRemove(req.params.catId, (err, product) => {
    if (product) {
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
