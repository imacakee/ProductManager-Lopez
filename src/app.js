const express = require("express");
const handlebars = require("express-handlebars");
const viewsRouter = require("./routes/views.router.js");
const { Server } = require("socket.io");
const { ProductManager, Product } = require("../products");
const PATH = "products/products.txt";
const pm = new ProductManager(PATH);

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`)
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productRouter = require("./routes/products.router");
const cartRouter = require("./routes/cart.router");
const io = new Server(httpServer);

app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "main",
  })
);

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

app.use(express.static(__dirname + "/public"));

app.use("/api/products", productRouter);

app.use("/api/carts", cartRouter);

app.use("/", viewsRouter);

io.on("connection", async (socket) => {
  socket.on("product_send", async (product) => {
    await pm.addProduct(product);
    const products = await pm.getProducts();
    socket.emit("products", products);
  });

  socket.emit("products", await pm.getProducts());
});
