const { authToken, authorization } = require("../utils");

const middleware = {};

middleware.swapRole = [authToken, authorization(["user", "premium"])];

module.exports = middleware;
