const { Router } = require("express");

const router = Router();

router.get("/login", (req, res) => {
  res.render("github-log");
});

router.get("/error", (req, res) => {
  res.render("error", { error: "No se pudo autenticar usando GitHub!" });
});

module.exports = router;
