const { Router } = require("express");
const { validateUser } = require("../utils");

const router = Router();

router.get("/", validateUser, (req, res) => {
  res.render("home", {});
});

router.get("/realTimeProducts", validateUser, (req, res) => {
  res.render("realTimePrd", {});
});

router.get("/products", validateUser, (req, res) => {
  res.render("products", {});
});

module.exports = router;
