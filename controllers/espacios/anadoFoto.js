const getDB = require("../../bbdd/getDB");
const { fotoGuardada, formatDate } = require("../../helpers");

const anadoFoto = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Obtenemos el id del espacio.
    const { idEspacio } = req.params;

    // Si no recibimos ninguna foto lanzamos un error.
    if (!req.files || !req.files.foto) {
      const error = new Error("No se ha encontrado ningún archivo");
      error.httpStatus = 400;
      throw error;
    }

    // Comprobamos cuántas fotos tiene la entrada.
    const [fotos] = await connection.query(
      `SELECT id FROM fotos WHERE idEspacio = ?`,
      [idEspacio]
    );

    // Si hay 15 fotos lanzamos un error.
    if (fotos.length >= 15) {
      const error = new Error("Esta entrada ya tiene quince fotos");
      error.httpStatus = 403;
      throw error;
    }

    // Variable que almacenará el nombre de la imagen.
    let nombreFoto;

    try {
      // Guardamos la foto en el disco y obtenemos el nombre de la misma.
      nombreFoto = await fotoGuardada(req.files.foto);
    } catch (_) {
      const error = new Error("Formato de archivo incorrecto");
      error.httpStatus = 400;
      throw error;
    }

    // Guardamos el nombre de la foto en la base de datos
    await connection.query(
      `INSERT INTO fotos (nombre, idEspacio, createdAt) VALUES (?, ?, ?)`,
      [nombreFoto, idEspacio, formatDate(new Date())]
    );

    res.send({
      status: "ok",
      message: "La foto ha sido guardada",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = anadoFoto;
