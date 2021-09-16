const jwt = require('jsonwebtoken');

const authUsuario = async (req, res, next) => {
    try {
        // Obtenemos la cabecera de autorización.
        const { authorization } = req.headers;

        // Si no existe la cabecera de autorización lanzamos un error.
        if (!authorization) {
            const error = new Error('Falta la cabecera de autorización');
            error.httpStatus = 401;
            throw error;
        }

        // Variable que almacenará la info del token.
        let tokenInfo;

        try {
            // Desencriptamos el token.
            tokenInfo = jwt.verify(authorization, process.env.SECRET);
        } catch (_) {
            const error = new Error('El token no es válido');
            error.httpStatus = 401;
            throw error;
        }

        // Inyectamos en el objeto "request" la info del token: id, role.
        req.authUsuario = tokenInfo;

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = authUsuario;
