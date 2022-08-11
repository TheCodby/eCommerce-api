const express = require("express");
const { getCategories } = require("../controllers/category");

const categoryRouter = express.Router();

categoryRouter.get("/", getCategories);
module.exports = categoryRouter;
