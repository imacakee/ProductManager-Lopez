const { Router } = require("express");
const middleware = require("../../middlewares/users.premium.middleware");
const controller = require("../../controllers/users.controller");

const router = Router();

router.get("/", controller.list);

router.post("/:uid/documents", middleware.uploadFile, controller.uploadFile);

router.patch("/:uid/role", middleware.updateRole, controller.updateRole)

router.patch("/premium/:uid", middleware.swapRole, controller.swapRole);

router.delete("/", controller.removeInactive);

router.delete("/:email", middleware.deleteUser, controller.deleteUser)

module.exports = router;
