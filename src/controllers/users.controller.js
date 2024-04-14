const { faker } = require("@faker-js/faker");
const userDao = require("../services/users.service");
const UserRepository = require("../repository/user.repository");
const service = new UserRepository(userDao);
const controller = {};

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

module.exports = controller;
