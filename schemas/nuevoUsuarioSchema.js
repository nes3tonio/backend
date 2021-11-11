const Joi = require("joi");

const nuevoUsuarioSchema = Joi.object().keys({
  email: Joi.string()
    .required()
    .email()
    .error((errors) => {
      if (
        errors[0].code === "any.required" ||
        errors[0].code === "string.empty"
      )
        return new Error("Se requiere un email");

      return new Error("El email no es válido.");
    }),

  password: Joi.string()
    .required()
    .min(8)
    .max(100)
    .error((errors) => {
      switch (errors[0].code) {
        case "any.required":
          return new Error("Se requiere una contraseña");

        case "string.empty":
          return new Error("Se requiere una contraseña");

        default:
          return new Error("La contraseña debe tener entre 8 y 100 caracteres");
      }
    }),
});

module.exports = nuevoUsuarioSchema;
