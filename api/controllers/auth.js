require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { createHmac } = require("node:crypto");

const { generateRefreshToken } = require("../helpers/auth");
const joiSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(6)
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required(),
});

exports.signup = async (req, res, next) => {
  // Validate user inputs
  const error = joiSchema.validate(req.body);
  if (error?.error) {
    return res.status(500).json({
      error: error?.error?.details[0]?.message,
    });
  }
  // Check if email registerd before
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        res.status(409).json({
          error: "This email already used",
        });
      } else {
        bcrypt.hash(req.body.password, 10, async (err, hash) => {
          // Store hash in your password DB.
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const response = await generateRefreshToken();
            const user = new User({
              _id: mongoose.Types.ObjectId(),
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              email: req.body.email,
              password: hash,
              created_at: new Date(),
              refresh_token: response,
            });
            user
              .save()
              .then(async (result) => {
                res.status(201).json({
                  message: "Created user successfully!",
                  user: {
                    id: result._id,
                    first_name: result.first_name,
                    last_name: result.last_name,
                    created_at: result.created_at,
                    refreshToken: response,
                  },
                });
              })
              .catch((err) => {
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
  return next;
};

exports.login = async (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          error: "Auth failed",
        });
      } else {
        bcrypt.compare(
          req.body.password,
          user.password,
          async (err, result) => {
            if (err) {
              return res.status(500).json({
                error: err,
              });
            }
            if (result) {
              const token = jwt.sign(
                {
                  _id: user._id,
                  first_name: user.first_name,
                  last_name: user.last_name,
                  is_admin: user.is_admin,
                },
                process.env.JWT_SECRET_KEY,
                {
                  expiresIn: "1h",
                }
              );
              const new_refresh_token = await generateRefreshToken();
              await user.updateOne({ refresh_token: new_refresh_token }).exec();
              return res.status(200).json({
                message: "Authorization Successful",
                user: {
                  token: token,
                  refresh_token: new_refresh_token,
                },
              });
            } else {
              return res.status(401).json({
                error: "Wrong credentials",
              });
            }
          }
        );
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Wrong credentials",
      });
    });
};

exports.generateNewToken = (req, res, next) => {
  const token = req.body.refresh_token;
  if (token) {
    User.findOne({ refresh_token: token })
      .then((user) => {
        if (user) {
          const token = jwt.sign(
            {
              _id: user._id,
              first_name: user.first_name,
              last_name: user.last_name,
              refresh_token: user.refresh_token,
            },
            process.env.JWT_SECRET_KEY,
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).json({
            message: "Authorization Successful",
            token: token,
          });
        } else {
          res.status(401).json({
            error: "Refresh token was not provided",
          });
        }
      })
      .catch((error) => {
        res.status(401).json({
          error: error,
        });
      });
  } else {
    res.status(401).json({
      error: "ERROR",
    });
  }
};
