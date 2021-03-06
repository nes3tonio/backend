const getDB = require("../../bbdd/getDB");

const obtenerUsuario = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Obtenemos el id del usuario.
    const { idUsuario } = req.params;

    // Obtenemos el id del usuario que hace la request.
    const idReqUsuario = req.userAuth.id;

    // Obtenemos los datos del usuario.
    const [usuario] = await connection.query(
      //id es id
      //name email y avatar
      //role es si es registrado o admin
      `SELECT id, name, email, avatar, role FROM usuarios WHERE id = ?`,
      [idUsuario]
    );

    // Objeto con la info básica del usuario.
    const usuarioInfo = {
      name: usuario[0].name,
      avatar: usuario[0].avatar,
    };

    // Si el usuario que solicita los datos es el dueño de dicho usuario agregamos información
    // extra.
    if (usuario[0].id === idReqUsuario || req.userAuth.role === "admin") {
      usuarioInfo.email = usuario[0].email;
      usuarioInfo.role = usuario[0].role;
      usuarioInfo.createdAt = usuario[0].createdAt;
    }

    res.send({
      status: "ok",
      usuarioInfo,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = obtenerUsuario;
