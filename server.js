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

const newEspacio = require('./controllers/espacios/newEspacio');
const editarEspacio = require('./controllers/espacios/editarEspacio');




//Logger
app.use(morgan('dev'));

//Deserializamos el body
app.use(express.json());







//--ENDPOINTS DE ESPACIOS
//agrego un espacio nuevo
app.post('/espacios', newEspacio);

//edito un espacio
app.put('/espacios/:idEspacio', editarEspacio);

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
})