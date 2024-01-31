const passport = require("passport");
const jwtStrategy = require("passport-jwt");
const passportLocal = require("passport-local");

const userModel = require("../models/user.model.js");
const { cartModel } = require("../models/cart.model.js");
const { createHash } = require("../utils.js");

const localStrategy = passportLocal.Strategy;

const JwtStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;

const initializePassport = () => {
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.PRIVATE_KEY,
      },
      async (jwt_payload, done) => {
        console.log("Entrando a passport Strategy con JWT.");
        try {
          console.log("JWT obtenido del Payload");
          console.log(jwt_payload);
          return done(null, jwt_payload.user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "register",
    new localStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          const exist = await userModel.findOne({ email });
          if (exist) {
            console.log("El user ya existe!!");
            done(null, false);
          }
          const cart = await cartModel.create({ items: [] });
          const user = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            loggedBy: "form",
            cartId: cart._id,
          };
          const result = await userModel.create(user);
          console.log(result);
          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

const cookieExtractor = (req) => {
  let token = null;
  console.log("Entrando a Cookie Extractor");
  if (req && req.cookies) {
    console.log("Cookies presentes: ");
    console.log(req.cookies);
    token = req.cookies["jwtCookieToken"];
    console.log("Token obtenido desde Cookie:");
    console.log(token);
  }
  return token;
};

module.exports = initializePassport;
