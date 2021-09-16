const getDB = require('../../bbdd/getDB');

const newEntry = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = newEntry;
