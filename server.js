require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");

const app = express();

const { PORT } = process.env;

/**
 * #################
 * ## Middlewares ##
 * #################
 */
const espacioExiste = require("./middlewares/espacioExiste");
const usuarioExiste = require("./middlewares/usuarioExiste");
const authUsuario = require("./middlewares/authUsuario");
const canEdit = require("./middlewares/canEdit");

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
  votarEspacio,
} = require("./controllers/espacios");

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
  validarUsuario,
} = require("./controllers/usuarios");

//Logger
app.use(morgan("dev"));

//Deserializamos el body
app.use(express.json());

//deserializamos el body

app.use(fileUpload());

//--ENDPOINTS DE ESPACIOS

//agrego un espacio nuevo
app.post("/espacios", authUsuario, nuevoEspacio);

//edito un espacio

app.put(
  "/espacios/:idEspacio",
  authUsuario,
  espacioExiste,
  canEdit,
  editarEspacio
);

//obtengo la lista de espacios
app.get("/espacios", listadoEspacios);

//obtener un espacio en particular

app.get("/espacios/:idEspacio", espacioExiste, obtenerEspacio);

//voto un espacio

app.post(
  "/espacios/:idEspacio/votos",
  authUsuario,
  espacioExiste,
  votarEspacio
);
//añado una foto
app.post(
  "/espacios/:idEspacio/fotos",
  authUsuario,
  espacioExiste,
  canEdit,
  anadoFoto
);

// borro un espacio

app.delete(
  "/espacios/:idEspacio",
  authUsuario,
  espacioExiste,
  canEdit,
  borroEspacio
);

//borro una foto de un espacio

app.delete(
  "/espacios/:idEspacio/fotos/:idFoto",
  authUsuario,
  espacioExiste,
  canEdit,
  borroFotoEspacio
);

//ENDPOINTS DE USUARIOS

//creo un usuario pendiente de validar

app.post("/usuarios", nuevoUsuario);

//logeo usuario

app.post("/usuarios/login", authUsuario, usuarioExiste, logearUsuario);

//valido un usuario

app.get("/usuarios/validate/:registrationCode", validarUsuario);

//obtener usuario

app.get("/usuarios/:idUsuario", authUsuario, usuarioExiste, obtenerUsuario);

//Borrar usuario

app.delete("/usuarios/:idUsuario", authUsuario, usuarioExiste, borrarUsuario);

//editar usuario

app.put("/usuarios/:idUsuario", authUsuario, usuarioExiste, editarUsuario);

//editar la contraseña de usuario

app.put(
  "/usuarios/:idUsuario/password",
  authUsuario,
  usuarioExiste,
  editarPass
);

//envia un codigo de recuperacion de pass al usuario

app.put("/usuarios/password/recover", recuperarPass);

//reseteo la pass utilizando el codigo de recuperacion

app.put("/usuarios/password/reset", resetearPass);

//ENDOPOINTS DE RESERVAS

/**
 * ######################
 * ## Middleware Error ##
 * ######################
 */

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.httpStatus || 500).send({
    status: "error",
    message: error.message,
  });
});
/**
 * ##########################
 * ## Middleware Not Found ##
 * ##########################
 */

app.use((req, res) => {
  res.status(404).send({
    status: "error",
    message: "Not found",
  });
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
