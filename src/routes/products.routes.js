const { Router } = require("express");
const router = Router();
const productDao = require("../Daos/DbManager/product.dao");
const { authToken, passportCall } = require("../utils");

router.get("/", passportCall("jwt"), async (req, res) => {
  const { page, limit, category, sort } = req.query;
  const result = await productDao.getProducts(limit, page, sort, category);
  res.json(result);
});

router.get("/:pid", authToken, async (req, res) => {
  const product = await productDao.getProductById(req.params.pid);
  res.json(product);
});

router.post("/", authToken, async (req, res) => {
  const product = await productDao.addProduct(req.body);
  res.json(product);
});

router.put("/:pid", authToken, async (req, res) => {
  const product = await productDao.updateProduct(req.params.pid, req.body);
  res.json(product);
});

router.delete("/:pid", authToken, async (req, res) => {
  const product = await productDao.deleteProduct(req.params.pid);
  res.json(product);
});

module.exports = router;
