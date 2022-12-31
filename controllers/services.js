const {
  createService,
  getFirstsServs,
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
  eraseAllFromServ,
  fileRegister,
} = require("../db/service");

const { uploadAndProcessImage, deleteImage } = require("../helpers");

//devuelve los ultimos 10 servicios creados
const getServicesController = async (req, res, next) => {
  try {
    const servInf = await getFirstsServs();

    res.send({
      status: "200",
      message: "10 servicios creados mas recientes",
      info: servInf,
    });
  } catch (error) {
    next(error);
  }
};

//crea un nuevo servicio
const newServiceController = async (req, res, next) => {
  try {
    const { idUser, title, desc, servGroup } = req.body;
    const servId = await createService(idUser, title, desc, servGroup);

    if (req.files?.file) {
      const name = `s${servId}_${req.files.file.name}`;
      const response = await uploadAndProcessImage(req.files.file.data, name);
      const registeredFile = await fileRegister(servId, idUser, name);
    }
    res.send({
      status: "200",
      message: `Nuevo servicio creado por usuario ${idUser}`,
    });
  } catch (error) {
    next(error);
  }
};

//comenta un servicio
const commentServiceController = async (req, res, next) => {
  try {
    const { id, email, comment } = req.body;
    const ret = await addCommentToService(id, email, comment);

    res.send({
      status: "200",
      message: `Comentario añadido al servicio con ID: ${id}`,
      serv: ret[0],
      commentary: ret[1],
    });
  } catch (error) {
    next(error);
  }
};

//devuelve todos los servicios de un usuario
const getAllServsController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const servs = await getAllServById(id);

    res.send({
      status: "200",
      message: `Lista de servicios creados por el usuario ${id}`,
      info: servs,
    });
  } catch (error) {
    next(error);
  }
};

//devuelve los comentarios de un usuario
const myComsController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const coms = await getAllComsById(id);

    res.send({
      status: "200",
      message: `Lista de comentarios creados por el usuario ${id}`,
      info: coms[0],
    });
  } catch (error) {
    next(error);
  }
};

//devuelve todos los grupos
const allGroupsCotroller = async (req, res, next) => {
  try {
    const grs = await getAllGroups();

    res.send({
      status: "200",
      message: `Lista de grupos`,
      groups: grs,
    });
  } catch (error) {
    next(error);
  }
};

//crea un grupo nuevo
const createGroupController = async (req, res, next) => {
  try {
    const { groupName, description } = req.body;
    const gId = await newGroup(groupName, description);

    res.send({
      status: "200",
      message: `Se ha creado un nuevo grupo con id: ${gId}`,
    });
  } catch (error) {
    next(error);
  }
};

//borra un grupo por id
const delIdGroupController = async (req, res, next) => {
  try {
    const { id } = req.body;
    await delGroup(id);

    res.send({
      status: "200",
      message: `Se ha borrado el grupo con id: ${id}`,
    });
  } catch (error) {
    next(error);
  }
};

//borra todos los grupos
const delAllGroupsController = async (req, res, next) => {
  try {
    await delAllGroups();

    res.send({
      status: "200",
      message: `Se han borrado todos los grupos correctamente`,
    });
  } catch (error) {
    next(error);
  }
};

//devuelve todas las valoraciones de un usuario
const getAllVallsController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vals = await allVals(id);

    res.send({
      status: "200",
      message: `Lista de valoraciones del usuario con id: ${id}`,
      info: vals,
    });
  } catch (error) {
    next(error);
  }
};

//crea un nuevo trabajo
const createJobController = async (req, res, next) => {
  try {
    const { idServ, idUserOff, idUserRec } = req.body;
    const job = await newJob(idServ, idUserOff, idUserRec);

    res.send({
      status: "200",
      message: `Trabajo creado con éxito ${job.id_jobs}`,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

//crea una valoracion nueva
const createValController = async (req, res, next) => {
  try {
    const { idJob, val } = req.body;
    const info = await newVal(idJob, val);

    res.send({
      status: "200",
      message: `Nueva valoración creada con id: ${info[1]}`,
      job: info[0],
      valoration: val,
    });
  } catch (error) {
    next(error);
  }
};

//sube fichero al server
const uploadController = async (req, res, next) => {
  try {
    const { idServ, idUs } = req.body;

    if (req.files?.file) {
      const name = `s${idServ}_${req.files.file.name}`;
      await fileRegister(idServ, idUs, name);
      await uploadAndProcessImage(req.files.file.data, name);
    }
    //crear un registro de fichero
    //const info = await newFichUp(ijob, idus, name);
    /*let file = req.files.file;
    file.mv(
      `./uploads/${idus}_${info[0][0].id_uOffer}_${info[0][0].id_serv}_${ijob}_${file.name}`,
      (err) => {
        if (err) {
          return res.status(500).send({ message: err });
        } else {
          return res.send({
            status: "200",
            message: `Fichero subido exitosamente con id: ${info[1]}`,
            job: info[0][0],
          });
        }
      }
    );*/
    return res.send({
      status: "200",
      message: `Fichero subido exitosamente`,
    });
  } catch (error) {
    next(error);
  }
};

//Marca trabajo como solucionado y fija la fecha del dia de la solucion
const solvJobController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await solvJob(id);

    res.send({
      status: "200",
      message: `Trabajo con id: ${id}, solucionado`,
      job: job[0],
    });
  } catch (error) {
    next(error);
  }
};

//Marca trabajo como solucionado y fija la fecha del dia de la solucion
const checkIfJobIsSolvedController = async (req, res, next) => {
  try {
    const { id } = req.body;
    const solvedJob = await checkForSolvJob(id);

    solvedJob
      ? res.send({
          status: "200",
          message: solvedJob,
        })
      : res.send({
          status: "200",
          message: `No se encuentra el servicio`,
        });
  } catch (error) {
    next(error);
  }
};

//Borra un servicio propio por id
const delIdServiceController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const allPathNames = await eraseAllFromServ(id);

    for (let i = 0; i < allPathNames.length; i++) {
      await deleteImage(allPathNames[i].fich_path);
    }

    const response = await delServById(id);

    res.send({
      status: "200",
      message: `Servicio con id: ${id}, borrado satisfactoriamente`,
    });

    return response;
  } catch (error) {
    next(error);
  }
};

//Busca todos los comentarios de un servicio por su id
const getAllCommentsController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await allComsOneServ(id);

    res.send({
      status: "200",
      message: response,
    });

    return response;
  } catch (error) {
    next(error);
  }
};

//comprueba si el usuario loggeado tiene un trabajo concreto
const checkStayJobCotroller = async (req, res, next) => {
  try {
    const { id, idS } = req.body;
    const response = await checkMeInJob(id, idS);
    res.send({
      status: "200",
      message: response[0].yOn,
    });

    return response;
  } catch (error) {
    next(error);
  }
};

//devuelve los datos de un servicio
const getServController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const response = await getServ(id);
    res.send({
      status: "200",
      message: response,
    });

    return response;
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServicesController,
  newServiceController,
  commentServiceController,
  getAllServsController,
  myComsController,
  uploadController,
  allGroupsCotroller,
  createGroupController,
  delIdGroupController,
  delAllGroupsController,
  getAllVallsController,
  createJobController,
  createValController,
  solvJobController,
  delIdServiceController,
  getAllCommentsController,
  checkStayJobCotroller,
  checkIfJobIsSolvedController,
  getServController,
};
