const { Router } = require("express");
const { validateUser } = require("../utils");

const router = Router();

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/", validateUser, (req, res) => {
  res.render("profile", {
    user: req.session.user,
  });
});

module.exports = router;
