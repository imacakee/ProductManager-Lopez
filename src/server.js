require("dotenv").config();
const express = require("express");
const handlebars = require("express-handlebars");
const passport = require("passport");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const initializePassport = require("./config/passport.config.js");
const viewsRouter = require("./routes/views.routes.js");
const githubLoginViewRouter = require("./routes/github-log.views.js");
const sessionsRouter = require("./routes/sessions.router.js");
const usersViewRouter = require("./routes/users.views.router.js");
const { ProductManager, Product } = require("../products.js");

const PATH = "products/products.txt";
const pm = new ProductManager(PATH);

const app = express();
const httpServer = app.listen(process.env.PORT, () =>
  console.log(`Server listening on port ${process.env.PORT}`)
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productRouter = require("./routes/products.routes.js");
const cartRouter = require("./routes/cart.routes.js");
const io = new Server(httpServer);

app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "main",
  })
);

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 10 * 60,
    }),

    secret: "coderS3cr3t",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(cookieParser("CoderS3cr3tC0d3"));

initializePassport();
app.use(passport.initialize());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((db) => console.log("Db is connected"))
  .catch((error) => console.log(error));

module.exports = mongoose;

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

app.use(express.static(__dirname + "/public"));

app.use("/api/products", productRouter);

app.use("/", viewsRouter);
app.use("/api/carts", cartRouter);
app.use("/users", usersViewRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/github", githubLoginViewRouter);

io.on("connection", async (socket) => {
  socket.on("product_send", async (product) => {
    await pm.addProduct(product);
    const products = await pm.getProducts();
    socket.emit("products", products);
  });

  socket.emit("products", await pm.getProducts());
});
