const { Router } = require("express");
const middleware = require("../../middlewares/users.views.middleware");

const router = Router();

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/", middleware.profile, (req, res) => {
  res.render("profile", {
    user: req.session.user,
  });
});

module.exports = router;
