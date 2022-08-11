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
