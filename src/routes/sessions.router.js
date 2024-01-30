const { Router } = require("express");
const userModel = require("../models/user.model.js");

const router = Router();

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  console.log("Registrando usuario:");
  console.log(req.body);

  const exist = await userModel.findOne({ email });
  if (exist) {
    return res
      .status(400)
      .send({ status: "error", message: "Usuario ya existe!" });
  }

  const user = {
    first_name,
    last_name,
    email,
    age,
    password,
  };

  const result = await userModel.create(user);
  res.send({
    status: "success",
    message: "Usuario creado con extito con ID: " + result.id,
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (email == "adminCoder@coder.com" && password == "adminCod3r123") {
    req.session.admin = true;
    req.session.usuario = false;
    req.session.user = {
      name: "admin",
      email,
      age: undefined,
      role: "administrador",
    };
  } else {
    req.session.admin = false;
    req.session.usuario = true;
    const user = await userModel.findOne({ email, password });

    if (!user)
      return res
        .status(401)
        .send({ status: "error", error: "Incorrect credentials" });

    req.session.user = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
      role: "usuario",
    };
  }
  res.send({
    status: "success",
    payload: req.session.user,
    message: "Primer logueo realizado! :)",
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      res.json({ error: "Error logout", msg: "Error al cerrar la session" });
    }
    res.redirect("/users/login");
  });
});

module.exports = router;
