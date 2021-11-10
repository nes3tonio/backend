require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');

const app = express();

const { PORT } = process.env;

/**
 * #################
 * ## Middlewares ##
 * #################
 */
const espacioExiste = require('./middlewares/espacioExiste');
const usuarioExiste = require('./middlewares/usuarioExiste');
const authUsuario = require('./middlewares/authUsuario');
const canEdit = require('./middlewares/canEdit');

//CONTROLADORES
//espacio
const {
  editarEspacio,
  listadoEspacios,
  nuevoEspacio,
  obtenerEspacio,
  anadoFoto,
  borroEspacio,
  borroFotoEspacio,
} = require('./controllers/espacios');

//usuarios
const {
  obtenerUsuario,
  borrarUsuario,
  editarUsuario,
  nuevoUsuario,
  logearUsuario,
  editarPass,
  recuperarPass,
  resetearPass,
} = require('./controllers/usuarios');

//Logger
app.use(morgan('dev'));

//Deserializamos el body
app.use(express.json());

//deserializamos el body

app.use(fileUpload());

//--ENDPOINTS DE ESPACIOS
//agrego un espacio nuevo
app.post('/espacios', nuevoEspacio);

//edito un espacio
app.put('/espacios/:idEspacio', editarEspacio);

//obtengo la lista de espacios
app.get('/espacios', listadoEspacios);

//obtener un espacio en particular

app.get('/espacios/:idEspacio', obtenerEspacio);

//añado una foto
app.post('/espacios/:idEspacio/fotos', anadoFoto);

// borro un espacio

app.delete('/espacios/:idEspacio', borroEspacio);

//borro una foto de un espacio

app.delete('/espacios/:idEspacio/fotos/:idFoto', borroFotoEspacio);

//ENDPOINTS DE USUARIOS

//obtener usuario
app.get('/usuarios/:idUsuario', authUsuario, obtenerUsuario);

//Borrar usuario

app.delete('/usuarios/:idUsuario', authUsuario, borrarUsuario);

//editar usuario

app.put('/usuarios/:idUsuario', authUsuario, editarUsuario);

//creo un usuario pendiente de validar

app.post('/usuarios', nuevoUsuario);

//logeo usuario

app.post('/usuarios/login', logearUsuario);

//editar la contraseña de usuario

app.put('/usuarios/:idUsuario/password', authUsuario, editarPass);

//envia un codigo de recuperacion de pass al usuario

app.put('/usuarios/password/recover', recuperarPass);

//reseteo la pass
app.put('/usuarios/password/reset', resetearPass);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.httpStatus || 500).send({
    status: 'error',
    message: error.message,
  });
});

app.use((req, res) => {
  res.status(404).send({
    status: 'error',
    message: 'Not found',
  });
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
