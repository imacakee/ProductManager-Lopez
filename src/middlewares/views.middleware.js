const { authToken, passportCall, authorization } = require("../utils");

const middleware = {};

middleware.home = [authToken];

middleware.realTimePrd = [passportCall("jwt")];

middleware.products = [passportCall("jwt")];

middleware.cart = [passportCall("jwt")];

middleware.admin = [passportCall("jwt"), authorization(["admin"])];

module.exports = middleware;
