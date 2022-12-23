const {
  validarEmail,
  validarPass,
  uploadAndProcessImage,
  deleteImage,
} = require("../helpers");
const {
  createUser,
  checkUser,
  getUserById,
  checkAndChangePss,
  modUser,
  getCreatorById,
  imageExistence,
} = require("../db/user");
const jwt = require("jsonwebtoken");

require("dotenv").config();

//crea usuario nuevo
const newUserController = async (req, res, next) => {
  try {
    const { email, pssw } = req.body;
    let id = "";
    //valida el usuario
    const ve = await validarEmail(email);
    const vp = await validarPass(pssw);

    if (ve && vp) {
      id = await createUser(email, pssw);
    }

    res.send({
      status: "201",
      message: `User created with id: ${id}`,
    });
  } catch (error) {
    next(error);
  }
};

//recupera info del usuario por id
const getUserController = async (req, res, next) => {
  try {
    const id = req.idPropietario;
    const usInfo = await getUserById(id);

    res.send({
      status: "200",
      message: `Info user ${id}`,
      info: usInfo,
    });
  } catch (error) {
    next(error);
  }
};

//logguea al usuario
const loginController = async (req, res, next) => {
  try {
    const { email, pssw } = req.body;
    //checkea email y contraseña;
    const compEmail = await validarEmail(email);
    const compPass = await validarPass(pssw);

    if (compEmail && compPass) {
      const id = await checkUser(email, pssw);
      //meto la id en el token
      const token = jwt.sign({ id: id }, process.env.SECRET, {
        expiresIn: "15d",
      });

      if (id) {
        res.send({
          status: "200",
          message: `Usuario ${id} loggueado!`,
          token: token,
        });
      } else {
        res.send({
          status: "404",
          message: `tus credenciales no corresponden a las de un usuario registrado`,
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

//cambio de contraseña
const changePassController = async (req, res, next) => {
  try {
    const { id, psswOld, psswNew } = req.body;
    const compPssO = await validarPass(psswOld);
    const compPssN = await validarPass(psswNew);

    if (compPssO && compPssN) {
      await checkAndChangePss(id, psswOld, psswNew);
    }

    res.send({
      status: "200",
      message: `Password cambiada con exito`,
    });
  } catch (error) {
    next(error);
  }
};

//Modifica el usuario
const modifyUserController = async (req, res, next) => {
  try {
    const {
      id = 0,
      al = null,
      em = null,
      pssO = null,
      pssN = null,
      bio = null,
      fc = null,
    } = req.body;

    let newAvatar;
    let name = "";

    if (req.files?.avatar) {
      const oldImage = await imageExistence(id);
      if (oldImage != null) await deleteImage(oldImage);
      //console.log(oldImage);
      name = req.files.avatar.name;
      newAvatar = await uploadAndProcessImage(req.files.avatar.data, name);
    }

    console.log("imagen subida", newAvatar);

    await modUser(id, al, em, pssO, pssN, bio, name, fc);

    res.send({
      status: "200",
      message: `Usuario con id: ${id}, modificado correctamente`,
    });
  } catch (error) {
    next(error);
  }
};

//recupera info del usuario por id
const getUserCreatorInfoController = async (req, res, next) => {
  try {
    const { idCreator } = req.body;
    console.log("CONTROLADOR", idCreator);

    const usInfo = await getCreatorById(idCreator);

    console.log("FINALLY", usInfo[0]);

    res.send({
      status: "200",
      message: usInfo[0],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  newUserController,
  getUserController,
  loginController,
  changePassController,
  modifyUserController,
  getUserCreatorInfoController,
};
