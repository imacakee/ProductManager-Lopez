const CartRepository = require("../repository/cart.repository");
const cartDao = require("../services/cart.service");
const service = new CartRepository(cartDao);

const controller = {};

controller.list = async (req, res) => {
  const result = await service.getCarts(req.query);
  res.json(result);
};

controller.getById = async (req, res) => {
  const result = await service.getCartById(req.params.cid);
  res.json(result);
};

controller.create = async (req, res) => {
  const result = await service.addCart(req.body);
  res.json(result);
};

controller.purchase = async (req, res) => {
  const result = await service.purchase(req.params.cid, req.user.email);
  res.json(result);
};

controller.update = async (req, res) => {
  const result = await service.updateCart(req.params.cid, req.body.newCart);
  res.json(result);
};

controller.modifyProduct = async (req, res) => {
  const result = await service.modifyProduct(
    req.params.cid,
    req.params.pid,
    req.query.amount,
    req.user
  );
  res.json(result);
};

controller.delete = async (req, res) => {
  const result = await service.deleteCart(req.params.cid);
  res.json(result);
};

module.exports = controller;
