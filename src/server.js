const express = require("express");
const handlebars = require("express-handlebars");
const passport = require("passport");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const initializePassport = require("./config/passport.config.js");
const viewsRouter = require("./routes/views/views.routes.js");
const githubLoginViewRouter = require("./routes/views/github-log.views.js");
const sessionsRouter = require("./routes/api/sessions.router.js");
const usersViewRouter = require("./routes/views/users.views.router.js");
const { ProductManager, Product } = require("../products.js");
const productRouter = require("./routes/api/products.routes.js");
const cartRouter = require("./routes/api/cart.routes.js");
const MongoSingleton = require("./config/mongodb.singleton.js");
const { port, mongoUrl } = require("./config/config.js");
const { addLogger } = require("./utils.js");

const PATH = "products/products.txt";
const pm = new ProductManager(PATH);

const app = express();
const httpServer = app.listen(port, () =>
  console.log(`Server listening on port ${port}`)
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
      mongoUrl: mongoUrl,
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

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

app.use(express.static(__dirname + "/public"));
app.use(addLogger);

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

//TODO: MongoSingleton
const mongoInstance = async () => {
  try {
    await MongoSingleton.getInstance();
  } catch (error) {
    console.log(error);
  }
};
mongoInstance();
mongoInstance();
