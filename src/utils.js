const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");

//TODO: Remove legacy code
const validateUser = (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/users/login");
  }
  next();
};

//Crypto functions
const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const isValidPassword = (user, password) => {
  console.log(
    `Datos a validar: user-password: ${user.password}, password: ${password}`
  );
  return bcrypt.compareSync(password, user.password);
};

const generateJWToken = (user) => {
  return jwt.sign({ user }, process.env.PRIVATE_KEY, { expiresIn: "60s" });
};

const authToken = (req, res, next) => {
  //El JWT token se guarda en los headers de autorización.
  const authHeader = req.headers.authorization;
  console.log("Token present in header auth:");
  console.log(authHeader);
  if (!authHeader) {
    return res.redirect(401, "/users/login");
    // return res
    //   .status(401)
    //   .send({ error: "User not authenticated or missing token." });
  }
  const token = authHeader.split(" ")[1]; //Se hace el split para retirar la palabra Bearer.
  //Validar token
  jwt.verify(token, process.env.PRIVATE_KEY, (error, credentials) => {
    if (error)
      return res.status(403).send({ error: "Token invalid, Unauthorized!" });
    //Token OK
    req.user = credentials.user;
    console.log("Se extrae la informacion del Token:");
    console.log(req.user);
    next();
  });
};

// para manejo de errores
const passportCall = (strategy) => {
  return async (req, res, next) => {
    console.log("Entrando a llamar strategy: ");
    console.log(strategy);
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        return res
          .status(401)
          .send({ error: info.messages ? info.messages : info.toString() });
      }
      console.log("Usuario obtenido del strategy: ");
      console.log(user);
      req.user = user;
      next();
    })(req, res, next);
  };
};

// para manejo de Auth
const authorization = (role) => {
  return async (req, res, next) => {
    if (!req.user)
      return res.status(401).send("Unauthorized: User not found in JWT");

    if (req.user.role !== role) {
      return res
        .status(403)
        .send("Forbidden: El usuario no tiene permisos con este rol.");
    }
    next();
  };
};

module.exports = {
  validateUser,
  createHash,
  isValidPassword,
  generateJWToken,
  authToken,
  passportCall,
  authorization,
};
