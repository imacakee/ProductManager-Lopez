const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const cartSchema = new Schema({
  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: "products" },
      quantity: { type: Number, default: 1 },
    },
  ],
});

cartSchema.plugin(mongoosePaginate);

const cartModel = model("carts", cartSchema);

module.exports = { cartModel };
