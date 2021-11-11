const getDB = require("../../bbdd/getDB");
const {
  formatDate,
  verifyEmail,
  generateRandomString,
  validate,
} = require("../../helpers");
const nuevoUsuarioSchema = require("../../schemas/nuevoUsuarioSchema");

const nuevoUsuario = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Validamos los datos del body.
    await validate(nuevoUsuarioSchema, req.body);

    // Obtenemos los campos necesarios.
    const { email, password } = req.body;

    // Comprobamos si el email existe en la base de datos.
    const [usuario] = await connection.query(
      `SELECT id FROM usuarios WHERE email = ?`,
      [email]
    );

    // Si el email existe lanzamos un error.
    if (usuario.length > 0) {
      const error = new Error("Ya existe un usuario registrado con ese email");
      error.httpStatus = 409;
      throw error;
    }

    // Creamos un código de registro de un solo uso.
    const registrationCode = generateRandomString(40);

    // Enviamos un mensaje de verificación al email del usuario.
    await verifyEmail(email, registrationCode);

    // Guardamos al usuario en la base de datos junto al código de registro.
    await connection.query(
      `INSERT INTO usuarios (email, password, active, createdAt) VALUES (?, SHA2(?, 512), ?, ?)`,
      [email, password, true, formatDate(new Date())]
    );

    res.send({
      status: "ok",
      message: "Usuario registrado",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = nuevoUsuario;
