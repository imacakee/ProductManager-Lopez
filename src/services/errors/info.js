const generateUserErrorInfo = (user) => {
  return `Una o más propiedades fueron enviadas incompletas o no son válidas.
        Lista de propiedades requeridas:
            -> fist_name: type String, recibido: ${user.first_name}
            -> email: type String, recibido: ${user.email}
    `;
};

const generateUserErrorInfoENG = (user) => {
  return `Una o más propiedades fueron enviadas incompletas o no son válidas.
        Lista de propiedades requeridas:
            -> fist_name: type String, recibido: ${user.first_name}
            -> email: type String, recibido: ${user.email}
    `;
};

module.exports = { generateUserErrorInfo, generateUserErrorInfoENG };
