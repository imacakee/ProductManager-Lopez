const { authToken, authorization } = require("../utils");

const middleware = {};

middleware.list = [authToken];

middleware.getById = [authToken];

middleware.create = [authToken];

middleware.purchase = [authToken, authorization("user")];

middleware.update = [authToken];

middleware.modifyProduct = [authToken, authorization("user")];

middleware.delete = [authToken];

module.exports = middleware;
