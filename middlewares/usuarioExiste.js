const getDB = require('../bbdd/getDB');

const usuarioExiste = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        // Obtenemos el id del usuario.
        const { idUsuario } = req.params;

        // Obtenemos el usuario.
        const [usuario] = await connection.query(
            `SELECT id FROM usuarios WHERE id = ? AND deleted = false`,
            [idUsuario]
        );

        // Si el usuario no existe lanzamos un error.
        if (usuario.length < 1) {
            const error = new Error('El usuario no existe');
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

module.exports = usuarioExiste;
