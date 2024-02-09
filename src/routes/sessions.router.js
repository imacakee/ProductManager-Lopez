const { Router } = require("express");
const middleware = require("../middlewares/sessions.middleware.js");
const controller = require("../controllers/sessions.controller.js");

const router = Router();

router.post("/register", middleware.register, controller.register);

router.post("/login", controller.login);

router.get("/current", middleware.current, (req, res) => {
  res.render("current", { user: req.user });
});

router.get("/logout", controller.logout);

module.exports = router;
