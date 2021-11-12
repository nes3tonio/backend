const getDB = require("./getDB.js");
const faker = require("faker/locale/es");

const { formatDate } = require("../helpers");

async function main() {
  let connection;

  try {
    connection = await getDB();

    // Eliminamos las tablas existentes.
    await connection.query("DROP TABLE IF EXISTS votos");
    await connection.query("DROP TABLE IF EXISTS fotos");
    await connection.query("DROP TABLE IF EXISTS reservas");
    await connection.query("DROP TABLE IF EXISTS espacios");
    await connection.query("DROP TABLE IF EXISTS usuarios");

    console.log("Tablas eliminadas");

    await connection.query(`
        CREATE TABLE usuarios (
            id INT PRIMARY KEY AUTO_INCREMENT,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(500) NOT NULL,
            name VARCHAR(100),
            avatar VARCHAR(100),
            active BOOLEAN DEFAULT false,
            deleted BOOLEAN DEFAULT false,
            role ENUM ("administrador", "normal") DEFAULT "normal" NOT NULL,
            registrationCode VARCHAR(100),
            recoverCode VARCHAR(100),
            createdAt DATETIME NOT NULL,
            modifiedAt DATETIME
            )
            `);

    await connection.query(`
          CREATE TABLE espacios (
              id INT PRIMARY KEY AUTO_INCREMENT,
              idUsuario INT NOT NULL,
              FOREIGN KEY (idUsuario) REFERENCES usuarios(id),
              descripcion TEXT,
              precio FLOAT,
              horario DATETIME,
              capacidad INT,
              ocupacion BOOLEAN DEFAULT FALSE,
              status BOOLEAN DEFAULT FALSE,
              direccion VARCHAR (100),
              cif VARCHAR(100),
              razonsocial VARCHAR(100),
              contacto VARCHAR(100) NOT NULL,
              createdAt DATETIME NOT NULL,
              modifiedAt DATETIME
              )
              `);

    await connection.query(`
        CREATE TABLE reservas (
            id INT PRIMARY KEY AUTO_INCREMENT,
            idUsuario INT NOT NULL,
            FOREIGN KEY (idUsuario) REFERENCES usuarios(id),
            idEspacio INT NOT NULL,
            FOREIGN KEY (idEspacio) REFERENCES espacios(id),
            precio FLOAT, 
            ocupacion BOOLEAN DEFAULT FALSE,
            checkIn DATETIME NOT NULL,
            checkOut DATETIME,
            createdAt DATETIME NOT NULL           
        )
        `);

    await connection.query(`
        CREATE TABLE votos (
            id INT PRIMARY KEY AUTO_INCREMENT,
            idUsuario INT NOT NULL,
            FOREIGN KEY (idUsuario) REFERENCES usuarios(id),
            idEspacio INT NOT NULL,
            FOREIGN KEY (idEspacio) REFERENCES espacios(id),
            voto TINYINT NOT NULL,
            CONSTRAINT votos_CK1 CHECK (voto IN(1, 2, 3, 4, 5)),
            createdAt DATETIME NOT NULL
               )
             `);

    await connection.query(`
        CREATE TABLE fotos (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(100),
            idEspacio INT NOT NULL,
            FOREIGN KEY (idEspacio) REFERENCES espacios(id),
            createdAt DATETIME NOT NULL
              )
            `);

    // Insertar el usuario administrador.
    await connection.query(`
    INSERT INTO usuarios (email, password, name, active, role, createdAt)
    VALUES (
        "andregarcia.au@gmail.com",
        SHA2("123456", 512),
        "Andre",
        true,
        "administrador",
        "${formatDate(new Date())}"
    )
`);
    // Nº de usuarios que queremos introducir.
    const USERS = 10;

    // Insertamos los usuarios.
    for (let i = 0; i < USERS; i++) {
      // Datos de faker.
      const email = faker.internet.email();
      const name = faker.name.findName();

      // Fecha de cración.
      const createdAt = formatDate(new Date());

      await connection.query(`
          INSERT INTO usuarios (email, password, name, active, createdAt)
          VALUES ("${email}", SHA2("123456", 512), "${name}", true, "${createdAt}" )
      `);
    }

    // Insertar el usuario de pruebas.
    await connection.query(`
    INSERT INTO usuarios (email, password, name, active, createdAt)
    VALUES (
        "ambecas@hotmail.com",
        SHA2("123456", 512),
        "David",
        true,
        "${formatDate(new Date())}"
    )
`);

    console.log("Usuarios creados");
  } catch (error) {
    console.log(error);
  } finally {
    if (connection) {
      connection.release();
    }
    process.exit(0);
  }

  /* dudas
active and deleted boolean 

OCUPACION
rating

foreign keys de espacios
*/
}

main();
