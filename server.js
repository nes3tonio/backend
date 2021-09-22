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
 const entradaExiste = require('./middlewares/entradaExiste');
 const usuarioExiste = require('./middlewares/usuarioExiste');
 const authUsuario = require('./middlewares/authUsuario');
 const canEdit = require('./middlewares/canEdit');
 



//CONTROLADORES
//entrada
const { editarEspacio, listadoEspacios, nuevoEspacio, obtenerEspacio, anadoFoto, borroEspacio, borroFotoEspacio } = require('./controllers/espacios');

//usuarios
const { obtenerUsuario, borrarUsuario, editarUsuario, nuevoUsuario, logearUsuario } = require('./controllers/usuarios'); 






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


//Borrar Usuria

app.delete ("/usuarios/:idUsuario", authUsuario, borrarUsuario);

//editar usuario

app.put('/usuarios/:idUsuario', authUsuario, editarUsuario);

//creo un usuario pendiente de validar

app.post('/usuarios', nuevoUsuario);

//logeo usuario

app.post('/usuarios/registro', logearUsuario)


app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
})
