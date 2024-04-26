const multer = require("multer");
const {
  authToken,
  authorization,
  storage,
  neededDocuments,
} = require("../utils");

const middleware = {};
const upload = multer({ storage: storage });

middleware.uploadFile = [
  authToken,
  upload.fields([
    {
      name: "perfil",
      maxCount: 1,
    },
    {
      name: "identificacion",
      maxCount: 1,
    },
    {
      name: "comprobante_domicilio",
      maxCount: 1,
    },
    {
      name: "estado_cuenta",
      maxCount: 1,
    },
    {
      name: "documentos",
    },
    {
      name: "productos",
    },
  ]),
];

middleware.swapRole = [
  authToken,
  authorization(["user", "premium"]),
  neededDocuments(["identificacion", "estado_cuenta", "comprobante_domicilio"]),
];

middleware.updateRole = [authToken, authorization(["admin"])];

middleware.deleteUser = [authToken, authorization(["admin"])];

module.exports = middleware;
