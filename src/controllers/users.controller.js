const { faker } = require("@faker-js/faker");
const controller = {};

controller.fakeUser = (req, res) => {
  let person = faker.person.fullName({ firstName: String, lastName: String });
  let email = faker.internet.email();
  let age = faker.age.numeric({ min: 20, max: 100 });
  let password = faker.internet.password();
  res.send({ person, email, age, password });
};

module.exports = controller;
