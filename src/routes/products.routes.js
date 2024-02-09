const { Router } = require("express");
const router = Router();
const controller = require("../controllers/products.controller");
const middleware = require("../middlewares/products.middleware");

router.get("/", middleware.list, controller.list);

router.get("/:pid", middleware.getById, controller.getById);

router.post("/", middleware.create, controller.create);

router.put("/:pid", middleware.update, controller.update);

router.delete("/:pid", middleware.delete, controller.delete);

module.exports = router;
