const { Router } = require("express");
const middleware = require("../../middlewares/sessions.middleware.js");
const controller = require("../../controllers/sessions.controller.js");

const router = Router();

router.post("/register", middleware.register, controller.register);

router.post("/login", controller.login);

router.get("/current", middleware.current, controller.current);

router.get("/logout", middleware.logout, controller.logout);

router.post("/makeAdmin/:email", middleware.makeAdmin, controller.makeAdmin);

router.post("/clearDb", middleware.clearDb, controller.clearDb);

module.exports = router;
