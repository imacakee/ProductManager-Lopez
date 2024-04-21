const { faker } = require("@faker-js/faker");
const userDao = require("../services/users.service");
const UserRepository = require("../repository/user.repository");
const { sendEmail } = require("../utils");
const service = new UserRepository(userDao);
const controller = {};

controller.list = async (req, res) => {
  const result = await service.findAll();
  res.json(result);
};

controller.fakeUser = (req, res) => {
  let person = faker.person.fullName({ firstName: String, lastName: String });
  let email = faker.internet.email();
  let age = faker.age.numeric({ min: 20, max: 100 });
  let password = faker.internet.password();
  res.send({ person, email, age, password });
};

controller.swapRole = async (req, res) => {
  const result = await service.swapRole(req.params.uid);
  res.json(result);
};

controller.uploadFile = async (req, res) => {
  const result = await service.uploadFile(req.files, req.params.uid, req.query);
  res.json(result);
};

controller.removeInactive = async (req, res) => {
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  const query = {
    last_connection: { $lte: twoDaysAgo },
  };
  const idleUsers = await service.findAll(query);
  idleUsers.forEach((user) => {
    sendEmail(user.email);
  });
  const result = await service.removeInactive();
  res.json(result);
};

module.exports = controller;
