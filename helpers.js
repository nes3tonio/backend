const { format } = require("date-fns");
const sharp = require('sharp');
const path = require('path');
const { ensureDir, unlink } = require('fs-extra');
const uuid = require('uuid');
const { UPLOADS_DIRECTORY, SENDGRID_API_KEY, SENDGRID_FROM } = process.env;
const uploadsDir = path.join(__dirname, UPLOADS_DIRECTORY);



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

async function deletePhoto(photoName) {
  // Creamos la ruta absoluta al archivo.
  const photoPath = path.join(uploadsDir, photoName);

  // Eliminamos la foto del disco.
  await unlink(photoPath);
}



module.exports = {
  formatDate,
  validate,
  fotoGuardada,
  deletePhoto
};
