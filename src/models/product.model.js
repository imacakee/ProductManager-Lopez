const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: Boolean, required: true, default: true },
  thumbnail: { type: String, required: true },
  code: { type: String, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
});

const productModel = model("products", productSchema);

module.exports = { productModel };
