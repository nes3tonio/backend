const getDB = require("../../bbdd/getDB");
const { generateRandomString, sendMail } = require("../../helpers");

const recuperarPass = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Obtenemos el email.
    const { email } = req.body;

    // Si falta el email lanzamos un error.
    if (!email) {
      const error = new Error("Faltan campos");
      error.httpStatus = 400;
      throw error;
    }

    // Comprobamos si el email existe.
    const [usuario] = await connection.query(
      `SELECT id FROM usuarios WHERE email = ?`,
      [email]
    );

    // Si no existe ningún usuario con ese email lanzamos un error.
    if (usuario.length < 1) {
      const error = new Error("No existe ningún usuario con este email");
      error.httpStatus = 404;
      throw error;
    }

    // Generamos un código de recuperación.
    const recoverCode = generateRandomString(20);

    // Creamos el body del mensaje.
    const emailBody = `
            Se solicitó un cambio de contraseña para el usuario registrado con este email en la web de ANDA ESPACIOS

            El código de recuperación es: ${recoverCode}

            Si no has sido tú por favor, ignora este email.
        `;

    // Enviamos el email.
    await sendMail({
      to: email,
      subject: "Cambio de contraseña en ANDA ESPACIOS ",
      body: emailBody,
    });

    // Agregamos el código de recuperación al usuario con dicho email.
    await connection.query(
      `UPDATE usuarios SET recoverCode = ? WHERE email = ?`,
      [recoverCode, email]
    );

    res.send({
      status: "ok",
      message: "Email enviado",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = recuperarPass;
