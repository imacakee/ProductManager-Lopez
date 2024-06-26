const service = require("../services/product.service");
const usersService = require("../services/users.service");
const { generateProduct, sendDeleteProductEmail } = require("../utils");

const controller = {};

controller.list = async (req, res) => {
  const { page, limit, category, sort } = req.query;
  console.log(req.user);
  const result = await service.getProducts(limit, page, sort, category);
  res.json(result);
};

controller.generateProducts = (req, res) => {
  const email = req.user?.email ? req.user.email : req.query?.email;
  const result = [];
  for (let i = 0; i <= 99; i++) {
    result.push(generateProduct(email));
  }
  return res.json(result);
};

controller.getById = async (req, res) => {
  const result = req.params.pid;
  res.json(result);
};

controller.create = async (req, res) => {
  const result = await service.addProduct({
    ...req.body,
    owner: req.user.email,
  });
  res.json(result);
};

controller.update = async (req, res) => {
  const result = await service.updateProduct(req.params.pid, req.body);
  res.json(result);
};

controller.delete = async (req, res) => {
  const product = await service.getProductById(req.params.pid);
  const ownerEmail = product.owner;
  const owner = await usersService.findByEmail(ownerEmail);
  if (owner.role === "premium") {
    sendDeleteProductEmail(ownerEmail, product.title, product._id);
  }

  const result = await service.deleteProduct(req.params.pid);
  res.json(result);
};

module.exports = controller;
