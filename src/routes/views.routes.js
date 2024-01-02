const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
  res.render("home", {});
});

router.get("/realTimeProducts", (req, res) => {
  res.render("realTimePrd", {});
});

module.exports = router;
