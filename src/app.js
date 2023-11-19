const express = require("express");

const PORT = 8080;
const app = express();
const productRouter = require("./routes/products.router");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (request, response) => {
  response.send("<h1>hola mundo desde express</h1>");
});

// app.get("/products", async (req, res) => {
//   let productList = await pm.getProducts();
//   const limit = req.query.limit;
//   if (limit) {
//     productList = productList.slice(0, limit);
//   }
//   return res.json(productList);
// });

// app.get("/products/:pid", async (req, res) => {
//   const product = await pm.getProductById(req.params.pid);
//   res.json(product);
// });

app.use("/products", productRouter);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
