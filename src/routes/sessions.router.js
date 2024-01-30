const { Router } = require("express");
const passport = require("passport");
const { isValidPassword, generateJWToken } = require("../utils.js");
const userModel = require("../models/user.model.js");

const router = Router();

router.post("/register-legacy", async (req, res) => {
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

// Register
router.post(
  "/register",
  passport.authenticate("register", { session: false }),
  async (req, res) => {
    console.log("Registrando usuario:");
    res
      .status(201)
      .send({ status: "success", message: "Usuario creado con extito." });
  }
);

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      console.warn("User doesn't exists with username: " + email);
      return res.status(204).send({
        error: "Not found",
        message: "Usuario no encontrado con username: " + email,
      });
    }
    if (!isValidPassword(user, password)) {
      console.warn("Invalid credentials for user: " + email);
      return res.status(401).send({
        status: "error",
        error: "El usuario y la contraseña no coinciden!",
      });
    }
    const tokenUser = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
      role: user.role,
    };

    const access_token = generateJWToken(tokenUser);
    res.cookie("jwtCookieToken", access_token, {
      maxAge: 60000,
    });

    res.send({ message: "Login success!!" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: "error", error: "Error interno de la applicacion." });
  }
});

router.post("/login-legacy", async (req, res) => {
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
