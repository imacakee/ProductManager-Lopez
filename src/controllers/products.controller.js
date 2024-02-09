const service = require("../services/product.service");

const controller = {};

controller.list = async (req, res) => {
  const { page, limit, category, sort } = req.query;
  const result = await service.getProducts(limit, page, sort, category);
  res.json(result);
};

controller.getById = async (req, res) => {
  const result = await service.getProductById(req.params.id);
  res.json(result);
};

controller.create = async (req, res) => {
  const result = await service.addProduct(req.body);
  res.json(result);
};

controller.update = async (req, res) => {
  const result = await service.updateProduct(req.params.pid);
  res.json(result);
};

controller.delete = async (req, res) => {
  const result = await service.deleteProduct(req.params.pid);
  res.json(result);
};

module.exports = controller;
