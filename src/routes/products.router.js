const express = require("express");
const router = express.Router();
const { ProductManager, Product } = require("../../index");
const PATH = "products/products.txt";
const pm = new ProductManager(PATH);

router.get("/", async (req, res) => {
  let productList = await pm.getProducts();
  const limit = req.query.limit;
  if (limit) {
    productList = productList.slice(0, limit);
  }
  return res.json(productList);
});

router.get("/:pid", async (req, res) => {
  const product = await pm.getProductById(req.params.pid);
  res.json(product);
});

router.post("/", async (req, res) => {
  const { title, description, price, thumbnail, code, stock, category } =
    req.body;

  const p = new Product(
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    category
  );
  const result = await pm.addProduct(p);
  res.json(result);
});

router.put("/:pid", async (req, res) => {
  const result = await pm.updateProduct(req.params.pid, req.body);
  res.json(result);
});

router.delete("/:pid", async (req, res) => {
  const result = await pm.deleteProduct(req.params.pid);
  res.json(result);
})

module.exports = router;
