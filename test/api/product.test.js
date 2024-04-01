const { expect } = require("chai");
const { requester, adminUser } = require("../util");
const { v4 } = require("uuid");

describe("Product service", function () {
  let appJWT;
  let prdId;
  const prd = {
    title: "Mi titulo",
    description: "mi description",
    price: 100,
    thumbnail: "mi thumbnail",
    code: v4(),
    stock: 10,
    category: "mi categoria",
  };

  before(async function () {
    const { body } = await requester
      .post("/api/sessions/login")
      .send({ email: adminUser.email, password: adminUser.password });
    appJWT = body?.jwt;

    const { body: products } = await requester.get(
      `/api/products/mockingproducts?email=${adminUser.email}`
    );

    for (const product of products) {
      await requester
        .post("/api/products")
        .send(product)
        .set("Authorization", `Bearer ${appJWT}`)
        .set("Content-Type", "application/json");
    }
  });
  it("should fetch the list of products", async function () {
    const { body: products, status } = await requester
      .get("/api/products")
      .set("Authorization", `Bearer ${appJWT}`);
    expect(status).to.equal(200);
    expect(products.docs).to.be.a("array");
    expect(products.docs).to.have.lengthOf(10);
  });

  it("should create a product", async function () {
    const { body: createdProduct, status } = await requester
      .post("/api/products/")
      .send(prd)
      .set("Authorization", `Bearer ${appJWT}`);
    prdId = createdProduct._id;

    expect(status).to.be.equal(200);
    expect(createdProduct).to.be.a("object");
    expect(createdProduct.title).to.be.equal(prd.title);
  });

  it("should fetch a product with the given id", async function () {
    const { body: product, status } = await requester
      .get(`/api/products/${prdId}`)
      .set("Authorization", `Bearer ${appJWT}`);

    expect(status).to.be.equal(200);
    expect(product._id).to.be.equal(prdId);
  });

  it("should delete the product with the given id", async function () {
    const { body: deletedProduct, status } = await requester
      .delete(`/api/products/${prdId}`)
      .set("Authorization", `Bearer ${appJWT}`);

    expect(status).to.be.equal(200);
    expect(deletedProduct._id).to.be.equal(prdId);
  });
});
