const express = require("express");
const {
  createCategory,
  deleteCategory,
  createProduct,
  deleteProduct,
} = require("../controllers/admin");

const adminRouter = express.Router();
const categoryRouter = express.Router();
const productRouter = express.Router();

// category
categoryRouter.post("/create", createCategory);
categoryRouter.delete("/:categoryId", deleteCategory);

adminRouter.use("/category", categoryRouter);

// product
productRouter.post("/create", createProduct);
productRouter.delete("/:productId", deleteProduct);

adminRouter.use("/product", productRouter);

module.exports = adminRouter;
