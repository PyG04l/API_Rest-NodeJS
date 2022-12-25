"use strict";

const mysql = require("mysql2/promise");
const { pss } = require("../helpers");
const { MYSQL_HOST, MYSQL_DATABASE, MYSQL_USER } = process.env;

let pool;

const getConnection = async () => {
  if (!pool) {
    /*La funcion pss() debe recibir los codigos decimales ASCII de la
        contraseña en un array, ejemplo: [104, 111, 108, 97], si la contraseña
        fuera hola*/
    const ps = pss(97, 100, 109, 105, 110, 49, 50, 51, 52);
    pool = mysql.createPool({
      connectionLimit: 10,
      host: MYSQL_HOST,
      user: MYSQL_USER,
      password: ps,
      database: MYSQL_DATABASE,
      timezone: "Z",
    });
  }

  return await pool.getConnection();
};

module.exports = {
  getConnection,
};
