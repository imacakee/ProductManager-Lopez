const { Router } = require("express");
const middleware = require("../../middlewares/users.premium.middleware");
const controller = require("../../controllers/users.controller");

const router = Router();

router.post("/:uid/documents", middleware.uploadFile, controller.uploadFile);

router.patch("/premium/:uid", middleware.swapRole, controller.swapRole);

module.exports = router;
