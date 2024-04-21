const { Router } = require("express");
const middleware = require("../../middlewares/views.middleware");

const router = Router();

router.get("/", middleware.home, (req, res) => {
  res.render("home", {});
});

router.get("/realTimeProducts", middleware.realTimePrd, (req, res) => {
  res.render("realTimePrd", {});
});

router.get("/products", middleware.products, (req, res) => {
  res.render("products", {});
});

router.get("/cart", middleware.cart, (req, res) => {
  res.render("cart", {});
});

module.exports = router;
