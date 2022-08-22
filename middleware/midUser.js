const { generateError } = require('../helpers');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//autentica al usuario
const authUser = (req, res, next) => {

  try {
    const { authorization } = req.headers;

    //comprobamos que nos hay un header con la Authorization
    if (!authorization) {
      throw generateError('falta la cabecera de autorizacion', 401);
    }
    //comprobamos que el token sea correcto
    let token;

    try {
      token = jwt.verify(authorization, process.env.SECRET);
    } catch (error) {
      throw generateError('token incorrecto', 401);
    }

    //metemos la informacion del token en la req para usarla en el controlador
    req.idPropietario = token.id;

    //saltamos al controlador
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
    authUser,
};