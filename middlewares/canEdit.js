const getDB = require("../bbdd/getDB");

const canEdit = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Obtenemos el id de la entrada.
    const { idEspacio } = req.params;

    // Obtenemos el id de usuario de la entrada.
    const [owner] = await connection.query(
      `SELECT idUsuario FROM espacios WHERE id = ?`,
      [idEspacio]
    );

    // Si el usuario que hace la request no es el propietario o no
    // es el administrador lanzamos un error.
    if (
      owner[0].idUsuario !== req.userAuth.id &&
      req.userAuth.role !== "administrador"
    ) {
      const error = new Error("No tienes suficientes permisos");
      error.httpStatus = 401;
      throw error;
    }

    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = canEdit;
