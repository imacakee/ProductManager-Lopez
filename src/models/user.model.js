const mongoose = require("mongoose");

const collection = "users";

const schema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  age: Number,
  password: {
    type: String,
    required: true,
  },
  loggedBy: String,
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin", "premium"],
  },
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
    required: true,
  },
  documents: [
    {
      name: { type: String },
      reference: { type: String },
    },
  ],
  last_connection: { type: Date, required: true, default: Date.now },
});

const userModel = mongoose.model(collection, schema);

module.exports = userModel;
