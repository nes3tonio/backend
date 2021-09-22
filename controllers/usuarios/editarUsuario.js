const getDB = require('../../bbdd/getDB');

const {
    deletePhoto,
    fotoGuardada,
    formatDate,
    generateRandomString,
    verifyEmail,
} = require('../../helpers');

const editarUsuario = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        // Obtenemos el id del usuario que queremos modificar.
        const { idUsuario } = req.params;

        // Obtenemos el id del usuario que hace la request.
        const idRequsuario = req.authUsuario.id;

        // Obtenemos el nombre y el email.
        const { name, email } = req.body;

        // Lanzamos un error en caso de que no seamos dueños de este usuario.
        if (Number(idUsuario) !== idRequsuario) {
            const error = new Error(
                'No tienes permisos para editar este usuario'
            );
            error.httpStatus = 403;
            throw error;
        }

        // Si no llega ningún dato lanzamos un error.
        if (!name && !email && !(req.files && req.files.avatar)) {
            const error = new Error('Faltan campos');
            error.httpStatus = 400;
            throw error;
        }

        // Obtenemos el email, el nombre y el avatar del usuario actual.
        const [usuario] = await connection.query(
            `SELECT email, name, avatar FROM usuarios WHERE id = ?`,
            [idUsuario]
        );

        // Obtenemos la fecha de modificación.
        const modifiedAt = formatDate(new Date());

        /**
         * ############
         * ## Avatar ##
         * ############
         *
         * Comprobar si el usuario quiere insertar un nuevo avatar.
         *
         */
        if (req.files && req.files.avatar) {
            // Comprobamos si el usuario ya tiene un avatar previo.
            // De ser así eliminamos el avatar del disco.
            if (usuario[0].avatar) await deletePhoto(usuario[0].avatar);

            // Guardamos la foto el disco y obtenemos su nombre.
            const avatarName = await fotoGuardada(req.files.avatar);

            // Guardamos el avatar en la base de datos.
            await connection.query(
                `UPDATE usuarios SET avatar = ?, modifiedAt = ? WHERE id = ?`,
                [avatarName, modifiedAt, idUsuario]
            );
        }

        /**
         * ###########
         * ## Email ##
         * ###########
         *
         * En caso de que haya email debemos comprobar si es distinto al existente.
         *
         */
        if (email && email !== usuario[0].email) {
            // Comprobamos que el nuevo email no exista en la base de datos.
            const [existingEmail] = await connection.query(
                `SELECT id FROM usuarios WHERE email = ?`,
                [email]
            );

            // Si el email ya existe lanzamos un error.
            if (existingEmail.length > 0) {
                const error = new Error(
                    'Ya existe un usuario con ese email en la base de datos'
                );
                error.httpStatus = 409;
                throw error;
            }

            // Creamos un código de registro de un solo uso.
            const registrationCode = generateRandomString(40);

            // Enviamos un mensaje de verificación al nuevo email del usuario.
            await verifyEmail(email, registrationCode);

            // Actualizamos el usuario en la base de datos junto al código de registro.
            await connection.query(
                `UPDATE usuarios SET email = ?, registrationCode = ?, active = false, createdAt = ? WHERE id = ?`,
                [email, registrationCode, modifiedAt, idUsuario]
            );
        }

        /**
         * ##########
         * ## Name ##
         * ##########
         *
         * En caso de que haya nombre comprobamos si es distinto al existente.
         *
         */
        if (name && usuario[0].name !== name) {
            await connection.query(
                `UPDATE usuarios SET name = ?, modifiedAt = ? WHERE id = ?`,
                [name, modifiedAt, idUsuario]
            );
        }

        res.send({
            status: 'ok',
            message: 'Datos de usuario actualizados',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = editarUsuario;
