const { authToken } = require("../utils");

const middleware = {};

middleware.list = [authToken];

middleware.getById = [authToken];

middleware.create = [authToken];

middleware.update = [authToken];

middleware.modifyProduct = [authToken];

middleware.delete = [authToken];

module.exports = middleware;
