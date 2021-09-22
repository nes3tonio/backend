const getDB = require('../../bbdd/getDB');
const { formatDate } = require('../../helpers');

const editarPass = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        // Obtenemos el id del usuario del cuál queremos cambiar la contraseña.
        const { idUsuario } = req.params;

        // Obtenemos la contraseña vieja y la nueva.
        const { oldPassword, newPassword } = req.body;

        // Si no somos dueños de este usuario lanzamos un error.
        if (req.authUsuario.id !== Number(idUsuario)) {
            const error = new Error(
                'No tienes permisos para editar este usuario'
            );
            error.httpStatus = 403;
            throw error;
        }

        // Comprobamos si la contraseña activa es correcta.
        const [usuario] = await connection.query(
            `SELECT id FROM usuarios WHERE id = ? AND password = SHA2(?, 512)`,
            [idUsuario, oldPassword]
        );

        // Si la contraseña antigua no es correcta lanzamos un error.
        if (usuario.length < 1) {
            const error = new Error('Contraseña incorrecta');
            error.httpStatus = 401;
            throw error;
        }

        // Guardamos la nueva contraseña.
        await connection.query(
            `UPDATE usuarios SET password = SHA2(?, 512), modifiedAt = ? WHERE id = ?`,
            [newPassword, formatDate(new Date()), idUsuario]
        );

        res.send({
            status: 'ok',
            message: 'Contraseña actualizada',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = editarPass;