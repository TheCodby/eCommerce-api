const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { required: true, type: String, unique: true },
  password: {
    type: String,
    required: true,
  },
  refresh_token: { type: String },
  is_admin: {
    type: Number,
    enum: {
      values: [0, 1],
      message: "{VALUE} is not supported",
    },
    default: 0,
  },
  created_at: { type: Date, required: true, Date },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
