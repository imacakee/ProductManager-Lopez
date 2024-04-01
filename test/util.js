const chai = require("chai");
const supertest = require("supertest");
const { port } = require("../src/config/config");

const requester = supertest(`http://localhost:${port}`);
const expect = chai.expect;

const adminUser = {
  first_name: "test",
  last_name: "test lastname",
  email: "test@email",
  age: 24,
  password: "testpassword123",
};

module.exports = { requester, expect, adminUser };
