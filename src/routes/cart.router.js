const express = require("express");
const router = express.Router();
const { Cart, CartManager } = require("../../cart");
const PATH = "cart/cart.txt";
const cm = new CartManager(PATH);

router.get("/", async (req, res) => {
  const result = await cm.getCarts();
  res.json(result);
});

router.get("/:cid", async (req, res) => {
  const result = await cm.getCartById(req.params.cid);
  res.json(result);
});

router.post("/", async (req, res) => {
  const { products } = req.body;

  const result = await cm.createCart(products);
  res.json(result);
});

router.post("/:cid/product/:pid", async (req, res) => {
  const result = await cm.addProduct(req.params.cid, req.params.pid, 1);
  res.json(result);
});

module.exports = router;
