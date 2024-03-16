const { Router } = require("express");
const middleware = require("../../middlewares/users.premium.middleware");
const controller = require("../../controllers/users.premium.controller");

const router = Router();

router.patch("/premium/:uid", middleware.swapRole, controller.swapRole);

module.exports = router;
