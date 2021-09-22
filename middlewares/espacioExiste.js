const getDB = require('../bbdd/getDB');

const espacioExiste = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        // Obtenemos el id de la espacio.
        const { idEspacio } = req.params;

        // Obtenemos la espacio.
        const [espacio] = await connection.query(
            `SELECT id FROM espacios WHERE id = ?`,
            [idEspacio]
        );

        // Si la espacio no existe lanzamos un error.
        if (espacio.length < 1) {
            const error = new Error('La espacio no existe');
            error.httpStatus = 404;
            throw error;
        }

        next();
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = espacioExiste;
