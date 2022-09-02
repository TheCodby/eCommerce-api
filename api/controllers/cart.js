const { ObjectId } = require("mongodb");
const { getUserByToken } = require("../helpers/auth");
const { getPrice } = require("../helpers/product");
const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const paypal = require("@paypal/checkout-server-sdk");

const getCart = (exports.getCart = async (req, res, next) => {
  const userData = await getUserByToken(req.headers.authorization);
  Cart.findOne({ user_id: userData._id }, async (error, cart) => {
    if (cart) {
      const totalCost = await cart.getCost();
      cart.findProducts((err, results) => {
        if (err) {
          res.status(500).json({
            error: err,
          });
        } else if (results) {
          res
            .json({
              results,
              totalCost,
            })
            .status(200);
        }
      });
    } else {
      res
        .json({
          message: "Cart is empty",
        })
        .status(200);
    }
  });
});
exports.addProduct = async (req, res, next) => {
  const userData = await getUserByToken(req.headers.authorization);
  Cart.findOne({ user_id: userData._id }, async function (error, result) {
    if (!error) {
      // If the document doesn't exist
      if (!result) {
        // Create it
        result = new Cart({
          user_id: userData._id,
        });
        result.save();
      }
      const productPrice = await getPrice(req.body.product_id);
      let update = {
        $set: { quantity: req.body.quantity },
        $setOnInsert: {
          cart_id: result._id,
          product: req.body.product_id,
          cost: req.body.quantity * productPrice,
        },
      };
      CartItem.findOneAndUpdate(
        { product: req.body.product_id, cart_id: result._id },
        update,
        { upsert: true, new: true, runValidators: true },
        (err, result) => {
          if (!err && result) {
            getCart(req, res, next);
          } else if (err) {
            res.status(500).json({
              error: err.message,
            });
          }
        }
      );
    }
  });
};
exports.removeProduct = (req, res, next) => {
  CartItem.findOne(
    { product: ObjectId(req.params.productId) },
    async (err, item) => {
      if (item && !err) {
        await item.remove();
        res
          .json({
            message: `Successfully removed this product from cart`,
          })
          .status(200);
      } else {
        res.status(500).json({
          error: `This item doesn't exist`,
        });
      }
    }
  );
};
exports.checkout = async (req, res, next) => {
  const userData = await getUserByToken(req.headers.authorization);
  Cart.findOne({ user_id: userData._id }, async (error, cart) => {
    if (cart) {
      const totalCost = await cart.getCost();
      let enviroment = new paypal.core.SandboxEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
      );
      let client = new paypal.core.PayPalHttpClient(enviroment);
      let request = new paypal.orders.OrdersCreateRequest();
      items = [];
      const cartItems = await cart.findProducts();
      for (item in cartItems) {
        items = [
          ...items,
          {
            name: cartItems[item].product[0].name,
            quantity: cartItems[item].quantity,
            unit_amount: {
              value: cartItems[item].product[0].price,
              currency_code: "USD",
            },
            category: "PHYSICAL_GOODS",
          },
        ];
      }
      console.log(items);
      console.log(totalCost);
      request.requestBody({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: totalCost,
              breakdown: {
                item_total: {
                  /* Required when including the `items` array */
                  currency_code: "USD",
                  value: totalCost,
                },
              },
            },
            items,
          },
        ],
        application_context: {
          cancel_url: "http://192.168.8.109:3001/cart/checkout/failed",
          return_url: "http://192.168.8.109:3001/cart/checkout/successed",
        },
      });
      let createOrder = async function () {
        let response = await client.execute(request);
        res.json(response.result).status(200);
      };
      createOrder();
    } else {
      res
        .json({
          message: "Cart is not found",
        })
        .status(200);
    }
  });
};
exports.successCheckout = async (req, res, next) => {
  let enviroment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  );
  let client = new paypal.core.PayPalHttpClient(enviroment);
  request = new paypal.orders.OrdersCaptureRequest(req.query.token);
  request.requestBody({});
  // Call API with your client and get a response for your call
  let response = await client.execute(request);
  // If call returns body in response, you can get the deserialized version from the result attribute of the response.
  res.json(response.result).status(200);
};
