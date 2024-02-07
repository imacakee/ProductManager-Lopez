const { passportCall } = require("../utils");
const passport = require("passport");

const middleware = {};

middleware.register = [passport.authenticate("register", { session: false })];

middleware.current = [passportCall("jwt")];

middleware.products = [passportCall("jwt")];

module.exports = middleware;
