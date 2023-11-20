const express = require("express");

const PORT = 8080;
const app = express();
const productRouter = require("./routes/products.router");
const cartRouter = require("./routes/cart.router");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (request, response) => {
  response.send("<h1>hola mundo desde express</h1>");
});

app.use("/api/products", productRouter);

app.use("/api/carts", cartRouter);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
