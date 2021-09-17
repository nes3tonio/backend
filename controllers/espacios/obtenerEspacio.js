const getDB = require('../../bbdd/getDB');
const { formatDate, validate } = require('../../helpers');

const obtenerEspacio = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        // Obtenemos el id de la entrada.
        const { idEspacio } = req.params;

        // Obtenemos la información de la entrada.
        const [espacio] = await connection.query(
            `
                SELECT espacios.id, espacios.descripcion, espacios.precio, espacios.capacidad, espacios.direccion, espacios.cif, espacios.razonsocial, espacios.contacto, espacios.createdAt, espacios.idUsuario, AVG(IFNULL(votos.voto, 0)) AS votos
                FROM espacios
                LEFT JOIN votos ON (espacios.id = votos.idEspacio)
                WHERE espacios.id = ?
            `,
            [idEspacio]
        );

        res.send({
            status: 'ok',
            espacio,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = obtenerEspacio;
