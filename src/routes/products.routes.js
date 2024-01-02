const { Router } = require("express");
const router = Router();
const productDao = require("../daos/dbManager/product.dao");

router.get("/", async (req, res) => {
  const { limit } = req.query;
  const result = await productDao.getProducts(limit);
  res.json(result);
});

router.get("/:pid", async (req, res) => {
  const product = await productDao.getProductById(req.params.pid);
  res.json(product);
});

router.post("/", async (req, res) => {
  const product = await productDao.addProduct(req.body);
  res.json(product);
});

router.put("/:pid", async (req, res) => {
  const product = await productDao.updateProduct(req.params.pid, req.body);
  res.json(product);
});

router.delete("/:pid", async (req, res) => {
  const product = await productDao.deleteProduct(req.params.pid);
  res.json(product);
});

module.exports = router;
