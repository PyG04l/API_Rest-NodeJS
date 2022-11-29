'use strict';

const { generateError, getDateForm } = require('../helpers');
const { getConnection } = require('./poolDB');
const { getIdUserByMail } = require('./user');

//Crea nuevo servicio en base de datos
const createService = async (idUser, title, descr, servGroup) => {
    let connection;

    try {
        connection = await getConnection();

        await connection.query(`
            INSERT INTO services (id_user, nombre_servicio, description, grupo) VALUES (?, ?, ?, ?)`
            , [idUser, title, descr, servGroup]
        );

    } finally {
        if(connection) connection.release();
    }
};

//devuelve los 10 primeros registros de la tabla servicios (deberia devolver los 10 mas recientes)
const getFirstsServs = async () => {
    let connection;

    try {
        connection = await getConnection();

        const [result] = await connection.query(`
        SELECT s.id_service, s.id_user, s.nombre_servicio, s.description, s.grupo, u.alias, u.email, u.foto_path, IFNULL(c.numComentarios, 0) as numComentarios
FROM services as s
LEFT JOIN users_info AS u ON u.id_user = s.id_user
LEFT JOIN (
	SELECT id_serv, count(*) as numComentarios
    FROM comentarios 
    group by id_serv
) AS c ON s.id_service = c.id_serv
ORDER BY id_service DESC ;
            `,);

        return result;
    } finally {
        if(connection) connection.release();
    }
};

//devuelve la info de un servicio buscado por id
const getServById = async (id) => {
    let connection;

    try {
        connection = await getConnection();

        const [service] = await connection.query(`
            SELECT * FROM services WHERE id_service = ?
            `, [id]);

        return service;
    } finally {
        if(connection) connection.release();
    }
};

//devuelve todos los servicios de un usuario
const getAllServById = async (id) => {
    let connection;

    try {
        connection = await getConnection();

        const [service] = await connection.query(`
            SELECT * FROM services WHERE id_user = ?
            `, [id]);

        return service;
    } finally {
        if(connection) connection.release();
    }
};

//añade comentario a un servicio
const addCommentToService = async (id, email, comment) => {
    let connection;

    try {
        connection = await getConnection();
        
        const serv = await getServById(id);
        const idU = await getIdUserByMail(email);

        await connection.query(`
            INSERT INTO comentarios (id_serv, id_user, comment) VALUES (?, ?, ?)
            `, [id, idU, comment]);

        const com = [{
            "idUsuario": idU,
            "comentario": comment, 
        }];

        return [serv, com];
    } finally {
        if(connection) connection.release();
    }
};

//añade comentario a un servicio
const getAllComsById = async (id) => {
    let connection;

    try {
        connection = await getConnection();

        const coms = await connection.query(`
            SELECT * FROM comentarios WHERE id_user = ?
            `, [id]);
        return coms;
    } finally {
        if(connection) connection.release();
    }
};

//Crea un registro en la tabla de ficheros
const getAllGroups = async () => {
    let connection;

    try {
        connection = await getConnection();

        const grs = await connection.query(`
        SELECT * FROM grupos;
            `);

        return grs[0];
    } finally {
        if(connection) connection.release();
    }
};

//Crea un registro en la tabla de ficheros
const newFichUp = async (ijob, idus, name) => {
    let connection;

    try {  
        const date = getDateForm();
        connection = await getConnection();

        const job = await getJobById(ijob);

        const fich = await connection.query(`
            INSERT INTO ficheros (id_job, id_user, fich_path) VALUES (?, ?, ?);
            `, [ijob, idus, `./uploads/${idus}_${job[0][0].id_uOffer}_${job[0][0].id_serv}_${ijob}_${name}`]);

        return [job[0], fich[0].insertId];
    } finally {
        if(connection) connection.release();
    }
};

//Crea un nuevo grupo
const newGroup = async (ngr, dsc) => {
    let connection;

    try {
        connection = await getConnection();

        const gr = await connection.query(`
            INSERT INTO grupos (group_name, description) VALUES (?, ?);
            `, [ngr, dsc]);

        return gr[0].insertId;
    } finally {
        if(connection) connection.release();
    }
};

//Borra un grupo por id
const delGroup = async (id) => {
    let connection;

    try {
        connection = await getConnection();

        await connection.query(`
            DELETE FROM grupos WHERE id_group = ?;
            `, [id]);

    } finally {
        if(connection) connection.release();
    }
};

//Borra todos los grupos
const delAllGroups = async () => {
    let connection;

    try {
        connection = await getConnection();

        await connection.query(`
            DELETE FROM grupos;
            `);

    } finally {
        if(connection) connection.release();
    }
};

//Devuelve todas las valoraciones de un usuario
const allVals = async (id) => {
    let connection;

    try {
        connection = await getConnection();

        const vals = await connection.query(`
            SELECT * FROM valoraciones WHERE id_job = ?
            `, [id]);

        return vals[0];
    } finally {
        if(connection) connection.release();
    }
};

//Crea un nuevo trabajo
const newJob = async (iS, iUO, iUR) => {
    let connection;
    try {
        connection = await getConnection();

        const date = new Date();
        const dT = date.toISOString().slice(0, 19).replace('T', ' ');

        const jobId = await connection.query(`
        INSERT INTO trabajos (id_serv, id_uOffer, id_uReciber, fech_sol, resuelto) VALUES (?, ?, ?, ?, ?);
            `, [iS, iUO, iUR, dT, 0]);

        const job = await connection.query(`
        SELECT * FROM trabajos ORDER BY id_jobs DESC LIMIT 1;
        `)

        return job[0][0];
    } finally {
        if(connection) connection.release();
    }
};

//Busca un trabajo por id
const getJobById = async (idJob) => {
    let connection;

    try {
        connection = await getConnection();

        const job = await connection.query(`
            SELECT * FROM trabajos WHERE id_jobs = ?
            `, [idJob]);

        return job;

    } finally {
        if(connection) connection.release();
    }
};

//Crea una valoracion de un trabajo
const newVal = async (idJ, val) => {
    let connection;

    try {
        connection = await getConnection();

        const job = await getJobById(idJ);

        const valId = await connection.query(`
            INSERT INTO valoraciones (id_job, valoration) VALUES (?, ?);
            `, [idJ, val]);

        job[0][0].fech_sol = job[0][0].fech_sol.toString().slice(0, 24).replace('T', ' ');

        return [job[0], valId[0].insertId];

    } finally {
        if(connection) connection.release();
    }
};

//Marca trabajo como solucionado y guarda la fecha
const solvJob = async (id) => {
    let connection;

    try {
        connection = await getConnection();
        const date = new Date();
        const dT = date.toISOString().slice(0, 19).replace('T', ' ');

        let job = await getJobById(id);

        if (job[0].resuelto === 1) {
            throw generateError(`El trabajo con id ${job[0].id_jobs} ya esta resuelto`, 400);
        }


        await connection.query(`
            UPDATE trabajos SET fech_res = ?, resuelto = 1 WHERE id_jobs = ?;
            `, [dT, id]);

        job = await getJobById(id);

        job[0][0].fech_sol = job[0][0].fech_sol.toString().slice(0, 24).replace('T', ' ');
        job[0][0].fech_res = job[0][0].fech_sol.toString().slice(0, 24).replace('T', ' ');

        return job;

    } catch(err) {
        throw err;
    } finally {
        if(connection) connection.release();
    }
};

//Busca y borra un trabajo por id
const delServById = async (idServ) => {
    let connection;

    try {
        connection = await getConnection();

        const response = await connection.query(`
        DELETE FROM services WHERE id_service = ?;
            `, [idServ]);

        return response;

    } finally {
        if(connection) connection.release();
    }
};

//Devuelve todos los comentarios por id de servicio
const allComsOneServ = async (idServ) => {
    let connection;

    try {
        connection = await getConnection();

        const response = await connection.query(`
        SELECT * FROM comentarios WHERE id_serv = ? ORDER BY id_com DESC;
            `, [idServ]);

        return response[0];

    } finally {
        if(connection) connection.release();
    }
};


//Devuelve todos los comentarios por id de servicio
const checkMeInJob = async (idUs, idServ) => {
    let connection;

    try {
        connection = await getConnection();

        const response = await connection.query(`
        SELECT COUNT(*) AS yOn FROM trabajos WHERE id_uReciber = ? AND id_serv = ?;
            `, [idUs, idServ]);

        return response[0];

    } finally {
        if(connection) connection.release();
    }
};

//Devuelve todos los comentarios por id de servicio
const checkForSolvJob = async (idJob) => {
    let connection;

    try {
        connection = await getConnection();

        const response = await connection.query(`
        SELECT resuelto FROM trabajos WHERE id_jobs = ?;
            `, [idJob]);

        return response[0];

    } finally {
        if(connection) connection.release();
    }
};

//Devuelve los datos de un servicio
const getServ = async (id) => {
    let connection;

    try {
        connection = await getConnection();

        const response = await connection.query(`
        SELECT * FROM services WHERE id_service = ?;
            `, [id]);

        return response[0];

    } finally {
        if(connection) connection.release();
    }
};

module.exports = {
    createService,
    getFirstsServs,
    getServById,
    getAllServById,
    addCommentToService,
    getAllComsById,
    newFichUp,
    getAllGroups,
    newGroup,
    delGroup,
    delAllGroups,
    allVals,
    newJob,
    newVal,
    solvJob,
    delServById,
    allComsOneServ,
    checkMeInJob,
    checkForSolvJob,
    getServ,
};