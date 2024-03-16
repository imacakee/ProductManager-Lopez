const userDao = require("../services/users.service");
const UserRepository = require("../repository/user.repository");
const service = new UserRepository(userDao);

const controller = {};

controller.swapRole = async (req, res) => {
  const result = await service.swapRole(req.params.uid);
  res.json(result);
};

module.exports = controller;
