const { Router } = require("express");
const { authToken } = require("../utils");

const router = Router();

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/", authToken, (req, res) => {
  res.render("profile", {
    user: req.session.user,
  });
});

module.exports = router;
