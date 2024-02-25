const { authToken, authorization } = require("../utils");

const middleware = {};

middleware.list = [authToken];

middleware.getById = [authToken];

middleware.create = [authToken, authorization("admin")];

middleware.update = [authToken, authorization("admin")];

middleware.delete = [authToken, authorization("admin")];

module.exports = middleware;
