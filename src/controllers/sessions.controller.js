const ticketModel = require("../models/ticket.model.js");
const cartService = require("../services/cart.service.js");
const CustomError = require("../services/errors/custom.error.js");
const productService = require("../services/product.service.js");
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
    ticketModel;
    if (!user) {
      req.logger.warn("User doesn't exists with username: " + email);
      return res.status(204).send({
        error: "Not found",
        message: "Usuario no encontrado con username: " + email,
      });
    }
    if (!isValidPassword(user, password)) {
      req.logger.warn("Invalid credentials for user: " + email);
      return CustomError.createError({
        cause: "invalid credentials",
        message: "El usuario y la contraseña no coinciden!",
        code: 401,
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
    req.logger.error(`Error while loggin in: ${error}`);
    return CustomError.createError({
      cause: "error while loggin i",
      message: { error },
      code: 500,
    });
  }
};

controller.makeAdmin = async (req, res) => {
  try {
    const user = await usersService.findByEmail(req.params.email);
    const updatedUser = await usersService.updateUser(user._id, {
      role: "admin",
    });
    res.json(updatedUser);
  } catch (error) {
    console.log(error);
    return CustomError.createError({
      cause: "error while making user admin",
      message: { error },
      code: 500,
    });
  }
};

controller.clearDb = async (req, res) => {
  try {
    await cartService.clear();
    await productService.clear();
    await usersService.clear();
    res.send({ message: "database cleared" });
  } catch (error) {
    console.log(error);
    return CustomError.createError({
      cause: "error while clearing db",
      message: { error },
      code: 500,
    });
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

controller.current = (req, res) => {
  const user = req.user;
  delete user.email;
  res.render("current", { user: user });
};

module.exports = controller;
