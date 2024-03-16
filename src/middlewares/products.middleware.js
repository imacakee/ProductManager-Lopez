const { authToken, authorization, adminOrOwner } = require("../utils");

const middleware = {};

middleware.list = [authToken];

middleware.getById = [authToken];

middleware.create = [authToken, authorization(["admin", "premium"])];

middleware.update = [
  authToken,
  authorization(["admin", "premium"]),
  adminOrOwner,
];

middleware.delete = [
  authToken,
  authorization(["admin", "premium"]),
  adminOrOwner,
];

module.exports = middleware;
