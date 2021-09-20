const getDB = require('../../bbdd/getDB');
const { deletePhoto } = require('../../helpers');

const borroFotoEspacio = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        // Obtener el id del espacio y el id de la foto.
        const { idEspacio, idFoto } = req.params;

        // Obtenemos la foto.
        const [foto] = await connection.query(
            `SELECT nombre FROM fotos WHERE id = ? AND idEspacio = ?`,
            [idFoto, idEspacio]
        );

        // Si la foto no existe lanzamos un error.
        if (foto.length < 1) {
            const error = new Error('La foto no existe');
            error.httpStatus = 404;
            throw error;
        }

        // Borrar la foto del servidor.
        await deletePhoto(foto[0].nombre);

        // Borrar la foto de la base de datos.
        await connection.query(
            `DELETE FROM fotos WHERE id = ? AND idEspacio = ?`,
            [idFoto, idEspacio]
        );

        res.send({
            status: 'ok',
            message: 'Foto eliminada',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = borroFotoEspacio;