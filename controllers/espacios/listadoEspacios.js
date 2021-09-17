const getDB = require('../../bbdd/getDB');
const { formatDate } = require('../../helpers');

const listadoEspacios = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();
        const [espacios] = await connection.query(`
            SELECT espacios.id, espacios.descripcion, espacios.precio, espacios.capacidad, espacios.direccion, espacios.cif, espacios.razonsocial, espacios.contacto, espacios.createdAt, espacios.idUsuario, AVG(IFNULL(votos.voto, 0)) AS votos
            FROM espacios
            LEFT JOIN votos ON (espacios.id = votos.idEspacio)
            GROUP BY espacios.id, espacios.descripcion, espacios.precio, espacios.capacidad, espacios.direccion, espacios.cif, espacios.razonsocial, espacios.contacto, espacios.createdAt, espacios.idUsuario
        `);

        res.send({
            status: 'ok',
            espacios
        });

    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = listadoEspacios;
