const usersService = require("../services/users.service");
const { isValidPassword, generateJWToken } = require("../utils.js");
const controller = {};

controller.register = async (req, res) => {
  console.log("Registrando usuario:");
  res
    .status(201)
    .send({ status: "success", message: "Usuario creado con éxito." });
};

controller.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await usersService.findByEmail(email);
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
      maxAge: null,
    });

    res.send({
      message: "Login success!!",
      jwt: access_token,
      cartId: user.cartId,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ status: "error", error: "Error interno de la applicacion." });
  }
};

controller.logout = (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      res.json({ error: "Error logout", msg: "Error al cerrar la session" });
    }
    res.redirect("/users/login");
  });
};

module.exports = controller;
