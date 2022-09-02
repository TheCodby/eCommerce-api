const express = require("express");
const { getCategories, getCategory } = require("../controllers/category");

const categoryRouter = express.Router();

categoryRouter.get("/", getCategories);
categoryRouter.get("/:categoryId", getCategory);
module.exports = categoryRouter;
