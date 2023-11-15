const express = require("express");
const { ProductManager } = require("..");
const PATH = "products/products.txt";
const PORT = 5000;
const app = express();

app.get("/", (request, response) => {
  response.send("<h1>hola mundo desde express</h1>");
});

app.get("/products", async (req, res) => {
  const pm = new ProductManager(PATH);
  let productList = await pm.getProducts();
  const limit = req.query.limit;
  if (limit) {
    productList = productList.slice(0, limit);
  }
  return res.json(productList);
});

app.get("/products/:pid", async (req, res) => {
  const pm = new ProductManager(PATH);
  const product = await pm.getProductById(req.params.pid);
  res.json(product);
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
