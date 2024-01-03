const { Router } = require("express");
const router = Router();
const cartDao = require("../Daos/DbManager/cart.dao");

router.get("/", async (req, res) => {
  const result = await cartDao.getCarts(req.query);
  res.json(result);
});

router.get("/:cid", async (req, res) => {
  const result = await cartDao.getCartById(req.params.cid);
  res.json(result);
});

router.post("/", async (req, res) => {
  const result = await cartDao.addCart(req.body);
  res.json(result);
});

router.put("/:cid/", async (req, res) => {
  const result = await cartDao.updateCart(req.params.cid, req.body.newCart);
  res.json(result);
});

router.put("/:cid/product/:pid", async (req, res) => {
  const result = await cartDao.modifyProduct(
    req.params.cid,
    req.params.pid,
    req.query.amount
  );
  res.json(result);
});

router.delete("/:cid", async (req, res) => {
  const result = await cartDao.deleteCart(req.params.cid);
  res.json(result);
});

module.exports = router;
