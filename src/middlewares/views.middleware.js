const { authToken, passportCall } = require("../utils");

const middleware = {};

middleware.home = [authToken];

middleware.realTimePrd = [passportCall("jwt")];

middleware.products = [passportCall("jwt")];

middleware.cart = [passportCall("jwt")];

module.exports = middleware;
