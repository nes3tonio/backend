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
const { editarEspacio, listadoEspacios, nuevoEspacio, obtenerEspacio } = require('./controllers/espacios')





//Logger
app.use(morgan('dev'));

//Deserializamos el body
app.use(express.json());







//--ENDPOINTS DE ESPACIOS
//agrego un espacio nuevo
app.post('/espacios', nuevoEspacio);

//edito un espacio
app.put('/espacios/:idEspacio', editarEspacio);

//obtengo la lista de espacios
app.get('/espacios', listadoEspacios);


//obtener un espacio en particular

app.get('/espacios', obtenerEspacio);

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
})