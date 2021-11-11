const getDB = require("../../bbdd/getDB");

const validarUsuario = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Obtenemos el código de registro.
    const { registrationCode } = req.params;

    // Comprobamos si hay algún usuario pendiente de validar con ese código.
    const [user] = await connection.query(
      `SELECT id FROM usuarios WHERE registrationCode = ?`,
      [registrationCode]
    );

    // Si no hay usuarios pendientes de validar lanzamos un error.
    if (user.length < 1) {
      const error = new Error(
        "No hay usuarios pendientes de validad con este código"
      );
      error.httpStatus = 404;
      throw error;
    }

    // Activamos el usuario y eliminamos el código.
    await connection.query(
      `UPDATE usuarios SET active = true, registrationCode = NULL WHERE registrationCode = ?`,
      [registrationCode]
    );

    res.send({
      status: "ok",
      message: "Usuario activado",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = validarUsuario;
