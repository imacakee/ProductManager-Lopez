const { Schema, model } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const ticketSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, default: uuidv4() },
    purchaseDate: { type: Date, required: true, default: Date.now },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const ticketModel = model("tickets", ticketSchema);

module.exports = ticketModel;
