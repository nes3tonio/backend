const { format } = require("date-fns");
const sharp = require("sharp");
const path = require("path");
const { ensureDir, unlink } = require("fs-extra");
const uuid = require("uuid");
const { UPLOADS_DIRECTORY, SENDGRID_API_KEY, SENDGRID_FROM } = process.env;
const crypto = require("crypto");
const sgMail = require("@sendgrid/mail");
const uploadsDir = path.join(__dirname, UPLOADS_DIRECTORY);

// Asignamos el API Key a Sendgrid.
sgMail.setApiKey(SENDGRID_API_KEY);

/**
 * ####################
 * ## getRandomValue ##
 * ####################
 */
function getRandomValue(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function formatDate(date) {
  return format(date, "yyyy-MM-dd HH:mm:ss");
}

async function validate(schema, data) {
  try {
    await schema.validateAsync(data);
  } catch (error) {
    error.httpStatus = 400;
    throw error;
  }
}
/**
 * ###############
 * ## fotoGuardada ##
 * ###############
 */

async function fotoGuardada(imagen) {
  // Comprobamos que el directorio de subida de imágenes existe.

  await ensureDir(uploadsDir);

  // Convertimos la imagenn a un objeto sharp.
  const sharpimagen = sharp(imagen.data);

  // Accedemos a los metadatos de la imagenn para comprobar su anchura.
  const imagenInfo = await sharpimagen.metadata();

  // Definimos el ancho máximo.
  const imagen_MAX_WIDTH = 1000;

  // Si el ancho de la imagenn supera el ancho máximo establecido
  // redimensinamos la imagenn.
  if (imagenInfo.width > imagen_MAX_WIDTH) sharpimagen.resize(imagen_MAX_WIDTH);

  // Generamos un nombre único para la imagenn.
  const imagennombre = `${uuid.v4()}.jpg`;

  // Creamos la ruta absoluta a la nueva ubicación de la imagenn.
  const imagenPath = path.join(uploadsDir, imagennombre);

  // Guardamos la imagenn en el directorio de uploads.
  await sharpimagen.toFile(imagenPath);
  // Retornamos el nombre del fichero.
  return imagennombre;
}

/**
 * #################
 * ## borroFoto ##
 * #################
 */
async function borroFoto(nombreFoto) {
  // Creamos la ruta absoluta al archivo.
  const fotoPath = path.join(uploadsDir, nombreFoto);

  // Eliminamos la foto del disco.
  await unlink(fotoPath);
}

function generateRandomString(length) {
  return crypto.randomBytes(length).toString("hex");
}

/**
 * ##############
 * ## sendMail ##
 * ##############
 */
async function sendMail({ to, subject, body }) {
  // Preparamos el mensaje.
  const msg = {
    to,
    from: SENDGRID_FROM,
    subject,
    text: body,
    html: `
          <div>
              <h1>${subject}</h1>
              <p>${body}</p>
          </div>
      `,
  };

  // Enviamos el mensaje.
  await sgMail.send(msg);
}

async function verifyEmail(email, registrationCode) {
  // Mensaje que enviaremos al usuario.
  const emailBody = `
      Te acabas de registrar en ANDA.
      Pulsa en este link para verificar tu cuenta: ${process.env.PUBLIC_HOST}/users/validate/${registrationCode}
  `;

  try {
    // Enviamos el mensaje al correo del usuario.
    await sendMail({
      to: email,
      subject: "Activa tu usuario de ANDA",
      body: emailBody,
    });
  } catch (error) {
    throw new Error("Error enviando el mensaje de verificación");
  }
}

module.exports = {
  formatDate,
  getRandomValue,
  fotoGuardada,
  borroFoto,
  generateRandomString,
  sendMail,
  verifyEmail,
  validate,
};
