const { Router } = require("express");
const { authToken, passportCall } = require("../utils");

const router = Router();

router.get("/", authToken, (req, res) => {
  res.render("home", {});
});

router.get("/realTimeProducts", authToken, (req, res) => {
  res.render("realTimePrd", {});
});

router.get("/products", passportCall("jwt"), (req, res) => {
  res.render("products", {});
});

module.exports = router;
