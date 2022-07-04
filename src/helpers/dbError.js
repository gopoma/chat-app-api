const duplicatedError = require("./duplicatedError");
const validationError = require("./validationError");

function dbError(error) {
  if(error.code === 11000) {
    return {
      created: false,
      errors: duplicatedError(error.keyValue)
    };
  }

  // Error en la validación
  return {
    created: false,
    errors: validationError(error.errors)
  };
}

module.exports = dbError;