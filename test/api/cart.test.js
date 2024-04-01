const { adminUser, requester, expect } = require("../util");

describe("Cart service", function () {
  let appJWT;
  let cartId;

  before(async function () {
    const loginResponse = await requester
      .post("/api/sessions/login")
      .send({ email: adminUser.email, password: adminUser.password });
    appJWT = loginResponse.body?.jwt;
    cartId = loginResponse.body?.cartId;
  });

  it("should fetch a list of carts", async function () {
    const { body, status } = await requester
      .get("/api/carts/")
      .set("Authorization", `Bearer ${appJWT}`);

    expect(status).to.be.equal(200);
    expect(body.docs).to.be.a("array");
  });

  it("should fetch a cart with the given id", async function () {
    const { body, status } = await requester
      .get(`/api/carts/${cartId}`)
      .set("Authorization", `Bearer ${appJWT}`);

    expect(status).to.be.equal(200);
    expect(body._id).to.be.equal(cartId);
  });

  it("should delete the cart with the given id", async function () {
    const { body, status } = await requester
      .delete(`/api/carts/${cartId}`)
      .set("Authorization", `Bearer ${appJWT}`);

    expect(status).to.be.equal(200);
    expect(body._id).to.be.equal(cartId);
  });
});
