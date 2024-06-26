const { passportCall, duringTests, authToken } = require("../utils");
const passport = require("passport");

const middleware = {};

middleware.register = [passport.authenticate("register", { session: false })];

middleware.current = [passportCall("jwt")];

middleware.logout = [passportCall("jwt")]

middleware.makeAdmin = [duringTests];

middleware.clearDb = [duringTests];

middleware.products = [passportCall("jwt")];

module.exports = middleware;
