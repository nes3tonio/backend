const getDB = require("../../bbdd/getDB");

const {
  formatDate,
  generateRandomString,
  borroFoto,
} = require("../../helpers");

const borrarUsuario = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Obtenemos el id del usuario que queremos borrar.
    const { idUsuario } = req.params;

    // Comprobamos que el id no se corresponda al id del administrador.
    if (Number(idUsuario) === 1) {
      const error = new Error(
        "El administrador principal no puede ser eliminado"
      );
      error.httpStatus = 403;
      throw error;
    }

    // Si el usuario que realiza la petición no es el dueño de la cuenta o no es
    // administrador lanzamos un error.
    if (
      req.userAuth.id !== Number(idUsuario) &&
      req.userAuth.role !== "administrador"
    ) {
      const error = new Error("No tienes suficientes permisos");
      error.httpStatus = 401;
      throw error;
    }

    // Obtenemos el nombre del avatar.
    const [usuario] = await connection.query(
      `SELECT avatar FROM usuarios WHERE id = ?`,
      [idUsuario]
    );

    // Si el usuario tiene avatar lo borramos del disco.
    if (usuario[0].avatar) {
      await deletePhoto(usuario[0].avatar);
    }

    // Anonimizamos al usuario.
    await connection.query(
      `
            UPDATE usuarios
            SET password = ?, name = "[deleted]", avatar = NULL, active = 0, deleted = 1, modifiedAt = ?
            WHERE id = ?
        `,
      [generateRandomString(40), formatDate(new Date()), idUsuario]
    );

    res.send({
      status: "ok",
      message: "Usuario eliminado",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = borrarUsuario;
