const getDB = require("../../bbdd/getDB");
const { formatDate, validate } = require("../../helpers");

const nuevoEspacio = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Obtenemos las propiedades del body.
    const {
      descripcion,
      precio,
      capacidad,
      direccion,
      cif,
      razonsocial,
      contacto,
      idUsuario,
    } = req.body;

    // Comprobamos que el usuario existe.
    const [usuario] = await connection.query(
      `SELECT * FROM usuarios WHERE id = ?`,
      [idUsuario]
    );

    // Si el usuario no existe lanzo un error.
    if (usuario.length < 1) {
      const error = new Error("El usuario no existe");
      error.httpStatus = 404;
      throw error;
    }

    // Fecha de creación.
    const createdAt = formatDate(new Date());

    // Creamos la entrada y guardamos el valor que retorna "connection.query".
    const [nuevoEspacio] = await connection.query(
      `
                INSERT INTO espacios (descripcion, precio, capacidad, direccion, cif, razonsocial, contacto, idUsuario, createdAt)
                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
      [
        descripcion,
        precio,
        capacidad,
        direccion,
        cif,
        razonsocial,
        contacto,
        idUsuario,
        createdAt,
      ]
    );

    res.send({
      status: "ok",
      message: "La entrada ha sido creada con éxito",
    });
  } catch (error) {
    console.error(error.message);
    res.send({
      status: "error",
      message: "El usuario no existe",
    });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = nuevoEspacio;
