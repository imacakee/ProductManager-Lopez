const { Router } = require("express");
const router = Router();
const middleware = require("../../middlewares/cart.middleware");
const controller = require("../../controllers/cart.controller");

router.get("/", middleware.list, controller.list);

router.get("/:cid", middleware.getById, controller.getById);

router.post("/", middleware.create, controller.create);

router.post("/:cid/purchase", middleware.purchase, controller.purchase);

router.put("/:cid/", middleware.update, controller.update);

router.put(
  "/:cid/product/:pid",
  middleware.modifyProduct,
  controller.modifyProduct
);

router.delete("/:cid", middleware.delete, controller.delete);

module.exports = router;
