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

    const { idUsuario } = req.params;

    //no sé si esto va a funcionar (el .role en concreto)
    const userRole = req.authUsuario.role;

    if (userRole === "administrador") {
      console.log("hola que tal AQUI");
      const error = new Error("No se puede borrar un usuario administrador");
      error.https = 403;
      throw error;
    }

    if (
      req.authUsuario.id !== Number(idUsuario) &&
      req.authUsuario.role !== "administrador"
    ) {
      const error = new Error("No tienes los permisos necesarios");
      error.https = 401;
      throw error;
    }

    const [usuario] = await connection.query(
      "SELECT avatar FROM usuarios WHERE id = ?",
      [idUsuario]
    );

    if (usuario[0].avatar) {
      await borroFoto(usuario[0].avatar);
    }

    await connection.query(
      `
                UPDATE usuarios
                SET password = ?, name = "[deleted]", avatar = NULL, active = 0, deleted = 1, modifiedAt = ?
                WHERE id = ?
            `,
      // por qué generaterandomstringaqui
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
