const getDB = require("../../bbdd/getDB");
const { formatDate, validate, fotoGuardada } = require("../../helpers");
const nuevoEspacioSchema = require("../../schemas/nuevoEspacioSchema");

const nuevoEspacio = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();
    // Validamos los datos del body.
    await validate(nuevoEspacioSchema, req.body);

    // Obtenemos el id del usuario que está creando la entrada.
    const idReqUser = req.userAuth.id;

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
    // Obtenemos el id de la entrada creada.
    const idEspacio = nuevoEspacio.insertId;

    // Comprobamos si "req.files" existe y si tiene contenido. Si es así guardamos las fotos.
    if (req.files && Object.keys(req.files).length > 0) {
      // Recorremos los valores de "req.files".
      for (const foto of Object.values(req.files).slice(0, 3)) {
        // Variable que almacenará el nombre de la imagen.
        let fotoNombre;

        try {
          // Guardamos la foto en el servidor y obtenemos el nombre de la misma.
          fotoNombre = await fotoGuardada(foto);
        } catch (_) {
          const error = new Error("Formato de archivo incorrecto");
          error.httpStatus = 400;
          throw error;
        }

        // Guardamos la foto.
        await connection.query(
          `INSERT INTO fotos (name, idEspacio, createdAt) VALUES (?, ?, ?)`,
          [fotoNombre, idEspacio, formatDate(new Date())]
        );
      }
    }

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
