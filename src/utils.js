const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { faker } = require("@faker-js/faker");
const { v4 } = require("uuid");
const nodemailer = require("nodemailer");
const winston = require("winston");
const {
  gmailAccount,
  gmailPassword,
  privateKey,
  environment,
} = require("./config/config");
const productService = require("./services/product.service");
const multer = require("multer");
const usersService = require("./services/users.service");

console.log("CREDENCIALES GMAIL");
console.log(gmailAccount);
console.log(gmailPassword);

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: gmailAccount,
    pass: gmailPassword,
  },
});

const emailOptionsToReset = {
  from: gmailAccount,
  subject: "reset password",
};

const temporaryEmail = {};

const sendEmailToResetPassword = (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send("email not provided");
    }
    //generamos token/id random
    const token = v4();
    const link = `http://localhost:8080/api/email/reset-password/${token}`;

    console.log("el objeto para el mail", emailOptionsToReset);

    temporaryEmail[token] = {
      email,
      //representa una hora en milisegundos
      expirationTime: new Date(Date.now() + 60 * 60 * 1000),
    };
    console.log(temporaryEmail);

    emailOptionsToReset.to = email;
    emailOptionsToReset.html = `To reset your password, click on the following link: <a href="${link}"> Reset password</a>`;

    transporter.sendMail(emailOptionsToReset, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send({ message: "error", payload: error });
      }
      console.log("las keys de la info", Object.keys(info));
      console.log("message sent: %s", info?.messageId);
      res.send({ message: "success", payload: info });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: error,
      message: "no se pudo enviar el email desde:" + gmailAccount,
    });
  }
};

const resetPassword = (req, res) => {
  const token = req.params.token;
  const email = temporaryEmail[token];
  console.log(email);

  const now = new Date();
  const expirationTime = email?.expirationTime;

  if (now > expirationTime || !expirationTime) {
    delete temporaryEmail[token];
    console.log("expiration time completed");
    return res.redirect("/reset-password");
  }

  res.send("<h1>Start reset password process</h1>");
};

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

const sendEmail = (email, ticket = null) => {
  let html = "";
  let subject = "";
  if (ticket) {
    html = `
    <h1>Gracias por su compra!<h1/>
    <h3>Codigo nro: ${ticket.code}<h3/>
    <h3>Coste total: ${ticket.amount}<h3/>
    <h3>Fecha de compra: ${ticket.purchaseDate}<h3/>
    `;
    subject = "Ticket de compra";
  } else {
    html = `
    <h1>Cuenta dada de baja<h1/>
    <p>Lamentamos informale que debido a inactividad hemos dado de baja su cuenta</p>
    `;
    subject = "Desactivación de cuenta";
  }

  const options = {
    from: gmailAccount,
    to: email,
    subject,
    html,
  };

  return transporter.sendMail(options, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent to ${email}`);
    }
  });
};

function sendDeleteProductEmail(email, title, id) {
  const html = `
  <h1>Estimado Cliente</h1>
  <p>Lamentamos comunicarle que se borrará su producto con id ${id} y titulo: ${title}</p>
  `;

  const options = {
    from: gmailAccount,
    to: email,
    subject: "Borrado de producto",
    html,
  };

  return transporter.sendMail(options, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent to ${email}`);
    }
  });
}

const validateUser = (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/users/login");
  }
  next();
};

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({ level: "http" }),
    new winston.transports.File({ filename: "./errors.log", level: "warn" }),
  ],
});

const addLogger = (req, res, next) => {
  req.logger = logger;

  req.logger.warn(
    `${req.method} en ${
      req.url
    } - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`
  );
  req.logger.http(
    `${req.method} en ${
      req.url
    } - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`
  );
  req.logger.error(
    `${req.method} en ${
      req.url
    } - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`
  );

  req.logger.debug(
    `${req.method} en ${
      req.url
    } - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`
  );

  next();
};

const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const isValidPassword = (user, password) => {
  console.log(
    `Datos a validar: user-password: ${user.password}, password: ${password}`
  );
  return bcrypt.compareSync(password, user.password);
};

const generateJWToken = (user) => {
  return jwt.sign({ user }, privateKey, { expiresIn: "1h" });
};

const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Token present in header auth:");
  console.log(authHeader);
  if (!authHeader) {
    req.logger.warn("No authorization header present in request");
    return res.redirect(401, "/users/login");
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, privateKey, (error, credentials) => {
    if (error) {
      req.logger.warn("error validating token: ", error);
      return res.status(403).send({ error: "Token invalid, Unauthorized!" });
    }
    req.user = credentials.user;
    console.log("Se extrae la informacion del Token:");
    console.log(req.user);
    next();
  });
};

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

const authorization = (roles) => {
  return async (req, res, next) => {
    if (!req.user) {
      req.logger.warn("No user found inside request object");
      return res.status(401).send("Unauthorized: User not found in JWT");
    }

    if (typeof roles === "object") {
      // hay más de un rol para chequear
      if (!roles.includes(req.user.role)) {
        req.logger.warn("Users role doesn't match required permissions");
        return res
          .status(403)
          .send("Forbidden: El usuario no tiene permisos con este rol.");
      }
    } else {
      // Hay un rol solo para chequear
      if (req.user.role !== roles) {
        req.logger.warn("Users role doesn't match required permissions");
        return res
          .status(403)
          .send("Forbidden: El usuario no tiene permisos con este rol.");
      }
    }

    next();
  };
};

const neededDocuments = (documents) => {
  return async (req, res, next) => {
    if (!req.user) {
      req.logger.warn("No user found inside request object");
      return res.status(401).send("Unauthorized: User not found in JWT");
    }

    if (!req.user.role === "premium") {
      const user = await usersService.findByEmail(req.user.email);
      const documentNames = user.documents.reduce((acc, curr) => {
        return acc.concat(curr.name);
      }, "");

      let hasAllDocuments = true;

      documents.forEach((doc) => {
        if (!documentNames.includes(doc)) {
          hasAllDocuments = false;
        }
      });

      if (!hasAllDocuments) {
        req.logger.warn("Users role doesn't match required permissions");
        return res
          .status(403)
          .send(
            "Forbidden: El usuario no cuenta con todos los documentos necesarios para pasar a premium."
          );
      }
    }

    next();
  };
};

const adminOrOwner = async (req, res, next) => {
  const product = await productService.getProductById(req.params.pid);
  if (
    !product?.id ||
    (product.owner !== req.user.email && req.user.role !== "admin")
  ) {
    req.logger.warn("Users role doesn't match required permissions");
    return res
      .status(403)
      .send("Forbidden: El usuario no tiene permisos con este rol.");
  }
  next();
};

const duringTests = async (req, res, next) => {
  if (!environment === "test") {
    req.logger.warn("This endpoint is only accesible during unit tests");
    return res.status(403).send("Forbidden");
  }
  next();
};

const generateProduct = (email = null) => {
  let owner = email ? email : faker.internet.email();
  return {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price({ min: 1, max: 1000 }),
    status: faker.datatype.boolean({ probability: 0.5 }),
    thumbnail: faker.lorem.text(),
    code: faker.string.uuid(),
    stock: faker.number.int({ min: 1, max: 9 }),
    category: faker.commerce.department(),
    owner,
  };
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    switch (file.fieldname) {
      case "perfil":
        cb(null, "public/uploads/profiles");
        break;
      case "productos":
        cb(null, "public/uploads/products");
        break;
      default:
        cb(null, "public/uploads/documents");
        break;
    }
  },
  filename: (req, file, cb) => {
    const originalname = file.originalname.split(".");
    const extension = originalname[originalname.length - 1];

    switch (file.fieldname) {
      case "perfil":
        cb(null, `${req.params.uid}.${extension}`);
        break;
      case "productos":
        if (!req.query.productId) {
          cb(
            new Error(
              "When uploading a product's image a productId query param is needed"
            )
          );
        }
        cb(null, `${req.query.productId}.${extension}`);
        break;
      case "documentos":
        cb(null, `${req.params.uid}_${file.originalname}`);
        break;
      default:
        cb(null, `${req.params.uid}_${file.fieldname}.${extension}`);
        break;
    }
  },
});

module.exports = {
  validateUser,
  createHash,
  isValidPassword,
  generateJWToken,
  authToken,
  passportCall,
  authorization,
  generateProduct,
  sendEmail,
  sendDeleteProductEmail,
  addLogger,
  adminOrOwner,
  sendEmailToResetPassword,
  resetPassword,
  duringTests,
  storage,
  neededDocuments,
};
