require('dotenv').config();

const { getConnection } = require('./poolDB');

async function main() {
    let connection;

    try {
        connection = await getConnection();

        await connection.query(`DROP TABLE IF EXISTS comentarios`);
        await connection.query(`DROP TABLE IF EXISTS valoraciones`);
        await connection.query(`DROP TABLE IF EXISTS ficheros`);
        await connection.query(`DROP TABLE IF EXISTS trabajos`);
        await connection.query(`DROP TABLE IF EXISTS services`);
        await connection.query(`DROP TABLE IF EXISTS grupos`);
        await connection.query(`DROP TABLE IF EXISTS users_info`);

        await connection.query(`
            CREATE TABLE users_info (
            id_user INT NOT NULL AUTO_INCREMENT,
            alias VARCHAR(50),
            email VARCHAR(50) NOT NULL,
            psswd VARCHAR(80) NOT NULL,
            biografia VARCHAR(150),
            foto_path VARCHAR(50),
            fec_nac DATE,
            PRIMARY KEY (id_user)
            );
        `);

        await connection.query(`
            CREATE TABLE grupos (
            id_group INT NOT NULL AUTO_INCREMENT,
            group_name VARCHAR(80) NOT NULL,
            description VARCHAR(150) NOT NULL,
            PRIMARY KEY (id_group)
            );
        `);

        await connection.query(`
            CREATE TABLE services (
            id_service INT NOT NULL AUTO_INCREMENT,
            id_user INT NOT NULL,
            nombre_servicio VARCHAR(75) NOT NULL,
            description VARCHAR(150) NOT NULL,
            grupo INT NOT NULL,
            PRIMARY KEY (id_service),
            FOREIGN KEY (id_user) 
            REFERENCES users_info (id_user),
            FOREIGN KEY (grupo)
            REFERENCES grupos (id_group)
            );
        `);

        await connection.query(`
            CREATE TABLE trabajos (
            id_jobs INT NOT NULL AUTO_INCREMENT,
            id_serv INT NOT NULL,
            id_uOffer INT NOT NULL,
            id_uReciber INT NOT NULL,
            fech_sol DATETIME NOT NULL,
            fech_res DATETIME,
            resuelto TINYINT,
            PRIMARY KEY (id_jobs),
            FOREIGN KEY (id_serv)
            REFERENCES services (id_service),
            FOREIGN KEY (id_uOffer)
            REFERENCES users_info (id_user),
            FOREIGN KEY (id_uReciber)
            REFERENCES users_info (id_user)
            );
        `);

        await connection.query(`
            CREATE TABLE ficheros (
            id_fich INT NOT NULL AUTO_INCREMENT,
            id_job INT NOT NULL,
            id_user INT NOT NULL,
            fich_path VARCHAR(200) NOT NULL,
            PRIMARY KEY (id_fich),
            FOREIGN KEY (id_job)
            REFERENCES trabajos (id_jobs),
            FOREIGN KEY (id_user)
            REFERENCES users_info (id_user)
            );
        `);
                
        await connection.query(`
            CREATE TABLE valoraciones (
            id_vals INT NOT NULL AUTO_INCREMENT,
            id_job INT NOT NULL,
            valoration VARCHAR(150) NOT NULL,
            PRIMARY KEY (id_vals),
            FOREIGN KEY (id_job)
            REFERENCES trabajos (id_jobs)
            );
        `);

        await connection.query(`
            CREATE TABLE comentarios (
            id_com INT NOT NULL AUTO_INCREMENT,
            id_serv INT NOT NULL,
            id_user INT NOT NULL,
            comment VARCHAR(150) NOT NULL,
            PRIMARY KEY (id_com),
            FOREIGN KEY (id_serv)
            REFERENCES services (id_service),
            FOREIGN KEY (id_user)
            REFERENCES users_info (id_user)
            );
        `);

        await connection.query(`
        INSERT INTO grupos (group_name, description)
        VALUES ('Imagen y Sonido', 'Montajes, animaciones, correcciones de video, correccion de imagenes, musica, equalizaciones, etc');
        `);

        await connection.query(`
        INSERT INTO grupos (group_name, description)
        VALUES ('Negocios y Marketing', 'Atencion personalizada, servicios SEO, web analytics, etc');
        `);

        await connection.query(`
        INSERT INTO grupos (group_name, description)
        VALUES ('Programacion y Tecnologia', 'Web development, Game development, chatbots, blockchain, etc');
        `);


    } catch(err) {
        console.error(err);
    } finally {
        if(connection) connection.release();
        process.exit();
    }
}

main();