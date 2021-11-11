const getDB = require("../../bbdd/getDB");

const listadoEspacios = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    // Obtenemos los posibles querystrings que puedan llegarnos.
    const { search, order, direction } = req.query;

    // Posibles valores para "order".
    const validOrderOptions = ["direccion", "createdAt", "votos"];

    // Posibles valores para "direction".
    const validDirectionOptions = ["DESC", "ASC"];

    // Establecemos que el orden por defecto sea por la columna votos en caso
    // de que no venga ningún orden definido.
    const orderBy = validOrderOptions.includes(order) ? order : "votos";

    // Establecemos la dirección por defecto en caso de que no venga una dirección dada.
    const orderDirection = validDirectionOptions.includes(direction)
      ? direction
      : "ASC";

    // Variable donde almacenaremos las entradas.
    let entries;

    //Obtenemos la informacion de la entrada.
    if (search) {
      [espacios] = await connection.query(
        `
            SELECT espacios.id, espacios.descripcion, espacios.precio, espacios.capacidad, espacios.direccion, espacios.cif, espacios.razonsocial, espacios.contacto, espacios.createdAt, espacios.idUsuario, AVG(IFNULL(votos.voto, 0)) AS votos
            FROM espacios
            LEFT JOIN votos ON (espacios.id = votos.idEspacio)
            WHERE espacios.direccion LIKE ? OR espacios.descripcion LIKE ?
            GROUP BY espacios.id, espacios.descripcion, espacios.precio, espacios.capacidad, espacios.direccion, espacios.cif, espacios.razonsocial, espacios.contacto, espacios.createdAt, espacios.idUsuario
            ORDER BY ${orderBy} ${orderDirection}
        `,
        [`%${search}%`, `%${search}%`]
      );
    } else {
      [espacios] = await connection.query(
        `
            SELECT espacios.id, espacios.descripcion, espacios.precio, espacios.capacidad, espacios.direccion, espacios.cif, espacios.razonsocial, espacios.contacto, espacios.createdAt, espacios.idUsuario, AVG(IFNULL(votos.voto, 0)) AS votos
            FROM espacios
            LEFT JOIN votos ON (espacios.id = votos.idEntry)
            GROUP BY espacios.id
            ORDER BY ${orderBy} ${orderDirection}
        `
      );
    }

    res.send({
      status: "ok",
      espacios,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = listadoEspacios;
