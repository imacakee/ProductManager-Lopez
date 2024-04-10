const { requester, adminUser, expect } = require("../util");

describe("Sessions service", function () {
  const usr = { email: adminUser.email, password: adminUser.password };

  it("should register user correctly", async function () {
    const { status, body } = await requester
      .post("/api/sessions/register")
      .send(adminUser)
      .set("Content-Type", "application/json");

    expect(status).to.be.equal(201);
    expect(body.message).to.be.equal("Usuario creado con éxito.");
  });

  it("should make user admin", async function () {
    const { status } = await requester.post(
      `/api/sessions/makeAdmin/${usr.email}`
    );

    expect(status).to.be.equal(200);
  });

  it("should login correctly", async function () {
    const { body, status } = await requester
      .post("/api/sessions/login")
      .send(usr);

    expect(status).to.be.equal(200);
    expect(body).to.have.property("jwt");
    expect(body).to.have.property("message");
    expect(body).to.have.property("cartId");
  });
});
