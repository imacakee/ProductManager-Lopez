const { passportCall } = require("../utils");

const middleware = {};

middleware.profile = [passportCall("jwt")];

module.exports = middleware;
