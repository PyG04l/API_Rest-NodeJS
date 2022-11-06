const Joi = require('joi');

//generador de errores
const generateError = (message, status) => {
    const err = new Error(message);
    err.httpStatus = status;
    return err;
}

//valida email
const validarEmail = async (email) => {
    const emEsc = Joi.string().email().required();
    const val = emEsc.validate(email);
    if (val.error) {
        throw generateError('Debes introducir un email válido', 400);
    }
    return true;
};

//valida password
const validarPass = async (pss) => {
    const paEsc = Joi.string().min(8).max(20).required();
    const val = paEsc.validate(pss);
    if (val.error) {
        throw generateError('Debes introducir una pass válida', 400);
    }
    return true;
};

//Esta funcion crea la password a partir de un array de los
//numeros correspondientes al codigo ascii de nuestros caracteres
const pss = (...theArgs) => {
    let ps = '';
    for (let i = 0; i < theArgs.length; i++) {
        ps += String.fromCharCode(theArgs[i]);        
    }
    console.log(ps);
    return ps;
};

//Formatea la fecha para incluirla en la BBDD
const getDateForm = () => {
    let sqlDate = '';
    const date = new Date();
    const dT = date.toISOString().slice(0, 16);
    for (let i = 0; i < dT.length; i++) {
        ((dT[i] == 'T') || (dT[i] == '-') || (dT[i] == ':')) ? sqlDate += '' : sqlDate += dT[i];        
    }
    return sqlDate;
};


module.exports = {
    generateError,
    validarEmail,
    validarPass,
    pss,
    getDateForm,
};
