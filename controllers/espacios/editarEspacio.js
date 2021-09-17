const getDB = require('../../bbdd/getDB');
const { formatDate } = require('../../helpers');



const editarEspacio = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        // Obtenemos el id del espacio
        const { idEspacio } = req.params;

        // Obtenemos las propiedades del body.
        let { descripcion, precio, capacidad, direccion, cif, razonsocial, contacto } = req.body;

        // Si faltan las dos propiedades lanzamos un error.
        if (!descripcion && !precio && !capacidad && !direccion && !cif && !razonsocial &&!contacto) {
            const error = new Error('Faltan campos');
            error.httpStatus = 400;
            throw error;
        }

        // Obtenemos el espacio
        const [espacio] = await connection.query(
            `SELECT descripcion, precio, capacidad, direccion, cif, razonsocial, contacto FROM espacios WHERE id = ?`,
            [idEspacio]
        );

        // Si existe alguno de estos valores nos quedamos con ese valor, pero si algún
        // valor es undefined, nos quedamos con el valor que ya había.
        descripcion = descripcion || espacio[0].descripcion;
        precio = precio || espacio[0].precio;
        capacidad = capacidad || espacio[0].capacidad;
        direccion = direccion || espacio[0].direccion;
        cif = cif || espacio[0].cif;
        razonsocial = razonsocial || espacio[0].razonsocial;

        // Fecha de modificación.
        const modifiedAt = formatDate(new Date());

        // Actualizamos el espacio
        await connection.query(
            `UPDATE espacios SET descripcion = ?, precio = ?, capacidad = ?, direccion = ?, cif = ?, razonsocial = ?, modifiedAt = ? WHERE id = ?`,
            [descripcion, precio, capacidad, direccion, cif, razonsocial, modifiedAt, idEspacio]
        );

        res.send({
            status: 'ok',
            entry: {
                id: idEspacio,
                descripcion,
                precio, 
                capacidad, 
                direccion, 
                cif, 
                razonsocial
            },
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = editarEspacio;
