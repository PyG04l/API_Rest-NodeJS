'use strict';

const bcrypt = require('bcrypt');
const { generateError } = require('../helpers');
const { getConnection } = require('./poolDB');

//Crea un usuario en la base de datos y devuelve su id
const createUser = async (email, password) => {
    let connection;

    try {
        connection = await getConnection();
        //Comprobar que no exista un usuario con ese email
        const [user] = await connection.query(`
            SELECT id_user FROM users_info WHERE email = ?
        `, [email]);

        if(user.length > 0) {
            throw generateError('Ya existe un usuario con ese email', 409);
        }

        //Encriptar la password
        const passHash = await bcrypt.hash(password, 8);

        //Crear el usuario
        const [newUser] = await connection.query(`
            INSERT INTO users_info (email, psswd) VALUES(?, ?)
        `, [email, passHash]);
        
        //Devolver la id
        return newUser.insertId;

    } catch(err) {
        throw err;
    } finally {
        if (connection) connection.release();
    }
};

//verificar usuario
const checkUser = async (email, password) => {
    let connection;
    try {
        connection = await getConnection();
        //Comprobar que ese email es el del usuario
        const [userid] = await connection.query(`
            SELECT id_user, psswd FROM users_info WHERE email = ?
        `, [email]);
        //Comprobar si es la misma contraseña
        const passComp = await bcrypt.compare(password, userid[0].psswd);

        if (userid[0].id_user === undefined || !passComp) {
            throw generateError('No existe el usuario', 400);
        }

        return userid[0].id_user;

    } catch(err) {
        throw err;
    } finally {
        if (connection) connection.release();
    }
}

//devuelve un usuario por id
const getUserById = async (id) => {
    let connection;
    try {
        connection = await getConnection();

        const [user] = await connection.query(`
            SELECT id_user, alias, email, biografia, foto_path, fec_nac FROM users_info WHERE id_user = ?
        `, [id]);

        return user;
    } catch (error) {
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

//devuelve la id de un usuario buscado por email
const getIdUserByMail = async (email) => {
    let connection;
    try {
        connection = await getConnection();

        const [userId] = await connection.query(`
            SELECT id_user FROM users_info WHERE email = ?
        `, [email]);
        return userId[0].id_user;
    } catch (error) {
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

//Crea una valoracion de un trabajo
const checkAndChangePss = async (id, pssOld, pssNew) => {
    let connection;

    try {
        connection = await getConnection();

        const [userPass] = await connection.query(`
            SELECT psswd FROM users_info WHERE id_user = ?
        `, [id]);

        //Comprobar si es la misma contraseña
        
        const passComp = await bcrypt.compare(pssOld, userPass[0].psswd);
        
        if ( passComp ) {
            //Encriptar la password
            const passHash = await bcrypt.hash(pssNew, 8);

            await connection.query(`
                UPDATE users_info SET psswd = ? WHERE id_user = ?;
                `, [passHash, id]);
        }

    } finally {
        if(connection) connection.release();
    }
};

//Modifica el usuario
const modUser = async (...theArgs) => {
    let connection;

    try {

        const parts = [`alias = ?`, `email = ?`, `psswd = ?`, `biografia = ?`, `foto_path = ?`, `fec_nac = ?`];
        let query = [];
        let vars = [];

        if ( theArgs.length > 1 ) {            
            for (let i = 0; i < theArgs.length; i++) {
                if (theArgs[i] != null && i != 0) {
                    query.push(parts[i-1]);
                    vars.push(theArgs[i])
                }
            }
        }
        vars.push(theArgs[0]);
        let completedQuery = `UPDATE users_info SET ${query.join(', ')} WHERE id_user = ?`;
        
        connection = await getConnection();

        await connection.query(completedQuery, vars);

    } finally {
        if(connection) connection.release();
    }
};


module.exports = {
    createUser,
    checkUser,
    getUserById,
    getIdUserByMail,
    checkAndChangePss,
    modUser,
}