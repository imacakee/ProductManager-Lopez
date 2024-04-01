const { requester } = require("./util");

function importTest(name, path) {
  console.log("estoy corriendo los tests");
  describe(name, function () {
    require(path);
  });
}

describe("Starting tests", async function () {
  importTest("sessions", "./api/sessions.test.js");
  importTest("products", "./api/product.test.js");
  importTest("carts", "./api/cart.test.js");

  after(async function () {
    await requester.post("/api/sessions/clearDb");
  });
});
