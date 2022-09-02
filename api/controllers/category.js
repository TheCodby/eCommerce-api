const { BSONTypeError } = require("bson");
const { ObjectId } = require("mongodb");
const { default: mongoose } = require("mongoose");
const Category = require("../models/Category");
const ITEMS_PER_PAGE = 20;

exports.getCategories = (req, res, next) => {
  let page = Math.max(0, req.query.page);
  Category.paginate(
    {},
    {
      populate: [
        {
          path: "products",
          options: {
            limit: 10,
            select: "_id name image",
          },
        },
      ],
      page: page,
      limit: 20,
    },
    function (err, result) {
      if (err) {
        res.status(500).json({
          error: err,
        });
      } else if (result) {
        res.json(result).status(200);
      }
    }
  );
};

exports.getCategory = async (req, res, next) => {
  try {
    const response = await Category.aggregate([
      { $match: { _id: ObjectId(req.params.categoryId) } },
      {
        $lookup: {
          from: "products",
          localField: "products",
          foreignField: "_id",
          as: "products",
        },
      },
    ]);
    if (response.length === 0) {
      throw "Not found";
    }
    res.json(response).status(200);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};
