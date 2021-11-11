const getDB = require("../../bbdd/getDB");
const { formatDate } = require("../../helpers");

const votarEspacio = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Obtenemos el id de la entrada.
    const { idEspacio } = req.params;

    // Obtenemos el id del usuario que realiza el voto.
    const idReqUsuario = req.authUsuario.id;

    // Obtenemos los datos.
    const { voto } = req.body;

    // Si faltan datos lanzamos un error.
    if (!idReqUsuario || !voto) {
      const error = new Error("Faltan campos");
      error.httpStatus = 400;
      throw error;
    }

    // Si el voto no está comprendido entre 1 y 5 lanzamos un error.
    if (voto < 1 || voto > 5) {
      const error = new Error("El voto debe ser un valor entero entre 1 y 5");
      error.httpStatus = 400;
      throw error;
    }

    // Comprobamos si el usuario existe.
    const [user] = await connection.query(
      `SELECT id FROM usuarios WHERE id = ?`,
      [idReqUsuario]
    );

    // Si el usuario no existe lanzamos un error.
    if (user.length < 1) {
      const error = new Error("El usuario no existe");
      error.httpStatus = 404;
      throw error;
    }

    // Obtenemos la entrada.
    const [espacio] = await connection.query(
      `SELECT idUsuario FROM espacios WHERE id = ?`,
      [idEspacio]
    );

    // Comprobamos si la entrada pertenece al usuario. Si es así lanzamos un error.
    if (espacio[0].idUsuario === Number(idReqUsuario)) {
      const error = new Error("No puedes votar tu propia entrada");
      error.httpStatus = 403;
      throw error;
    }

    // Comprobamos si el usuario ya ha votado anteriormente esta entrada.
    const [yaVotado] = await connection.query(
      `SELECT id FROM votos WHERE idUsuario = ? AND idEspacio = ?`,
      [idReqUsuario, idEspacio]
    );

    // Si el usuario ya ha votado la entrada lanzamos un error.
    if (yaVotado.length > 0) {
      const error = new Error("Ya votaste anteriormente esta entrada");
      error.httpStatus = 403;
      throw error;
    }

    // Añadimos el voto.
    await connection.query(
      `INSERT INTO votos (voto, idUsuario, idEspacio, createdAt) VALUES (?, ?, ? ,?)`,
      [voto, idReqUsuario, idEspacio, formatDate(new Date())]
    );

    res.send({
      status: "ok",
      message: "La votación se ha realizado con éxito",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = votarEspacio;
