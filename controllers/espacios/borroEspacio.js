const getDB = require("../../bbdd/getDB");
const { deletePhoto } = require("../../helpers");

const borroEspacio = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    //obtenemos el id del espacio

    const { idEspacio } = req.params;

    // Seleccionamos las fotos relacionadas con la entrada.
    const [fotos] = await connection.query(
      `SELECT nombre FROM fotos WHERE idEspacio = ?`,
      [idEspacio]
    );

    // Borramos las fotos del disco.
    for (const foto of fotos) {
      await deletePhoto(foto.nombre);
    }
/* 
    //obtenemos la infor del espacio

    const [espacio] = await connection.query(
      `
        SELECT * FROM espacios WHERE id = ?`,
      [idEspacio]
    );

    //si el espacio no existe lanzamos un error

    if (espacio.lenght < 1) {
      const error = new Error("La entrada no existe");
      error.httpStatus = 404;
      throw error;
    }
 */
    //borramos el espacio
    await connection.query(`DELETE FROM espacios WHERE id = ?`, [idEspacio]);
    console.log("hola mundo");
    res.send({
      status: "ok",
      message: `El espacio ha sido eliminado`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = borroEspacio;
