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
} = require('../db/service');

//devuelve los ultimos 10 servicios creados
const getServicesController = async (req, res, next) => {
    try {
        const servInf = await getFirstsServs();

        res.send({
            status: '200',
            message: '10 servicios creados mas recientes',
            info: servInf,

        })
    } catch(error) {
        next(error);
    }
};

//crea un nuevo servicio
const newServiceController = async (req, res, next) => {
    try {
        const {idUser, title, desc, servGroup} = req.body;
        await createService(idUser, title, desc, servGroup);
        
        res.send({
            status: '200',
            message: `Nuevo servicio creado por usuario ${idUser}`,

        })
    } catch(error) {
        next(error);
    }
};

//comenta un servicio
const commentServiceController = async (req, res, next) => {
    try {
        const { id, email, comment } = req.body;
        const ret = await addCommentToService(id, email, comment);

        res.send({
            status: '200',
            message: `Comentario añadido al servicio con ID: ${id}`,
            serv: ret[0],
            commentary: ret[1],

        })
    } catch(error) {
        next(error);
    }
};

//devuelve todos los servicios de un usuario
const getAllServsController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const servs = await getAllServById(id);
        
        res.send({
            status: '200',
            message: `Lista de servicios creados por el usuario ${id}`,
            info: servs,
        })

    } catch(error) {
        next(error);
    }
};

//devuelve los comentarios de un usuario
const myComsController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const coms = await getAllComsById(id);
        
        res.send({
            status: '200',
            message: `Lista de comentarios creados por el usuario ${id}`,
            info: coms[0],
        })

    } catch(error) {
        next(error);
    }
};

//devuelve todos los grupos
const allGroupsCotroller = async (req, res, next) => {
    try {

        const grs = await getAllGroups();

        res.send({
            status: '200',
            message: `Lista de grupos`,
            groups: grs,
        })

    } catch(error) {
        next(error);
    }
};

//crea un grupo nuevo
const createGroupController = async (req, res, next) => {
    try {
        const { groupName, description } = req.body;
        const gId = await newGroup(groupName, description);

        res.send({
            status: '200',
            message: `Se ha creado un nuevo grupo con id: ${gId}`,
        })

    } catch(error) {
        next(error);
    }
};

//borra un grupo por id
const delIdGroupController = async (req, res, next) => {
    try {
        const { id } = req.body;
        await delGroup(id);

        res.send({
            status: '200',
            message: `Se ha borrado el grupo con id: ${id}`,
        });

    } catch(error) {
        next(error);
    }
};

//borra todos los grupos
const delAllGroupsController = async (req, res, next) => {
    try {
        await delAllGroups();

        res.send({
            status: '200',
            message: `Se han borrado todos los grupos correctamente`,
        });

    } catch(error) {
        next(error);
    }
};

//devuelve todas las valoraciones de un usuario
const getAllVallsController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const vals = await allVals(id);

        res.send({
            status: '200',
            message: `Lista de valoraciones del usuario con id: ${id}`,
            info: vals,
        });

    } catch(error) {
        next(error);
    }
};

//crea un nuevo trabajo
const createJobController = async (req, res, next) => {
    try {
        const {idServ, idUserOff, idUserRec} = req.body;
        const newJobId = await newJob(idServ, idUserOff, idUserRec);

        res.send({
            status: '200',
            message: `Lista de valoraciones del usuario con id: ${newJobId}`,
        });

    } catch(error) {
        next(error);
    }
};

//crea una valoracion nueva
const createValController = async (req, res, next) => {
    try {
        const {idJob, val} = req.body;
        const info = await newVal(idJob, val);

        res.send({
            status: '200',
            message: `Nueva valoración creada con id: ${info[1]}`,
            job: info[0],
            valoration: val,            
        });

    } catch(error) {
        next(error);
    }
};

//sube fichero al server
const uploadController = async (req, res, next) => {
    try {
        const {ijob, idus, name} = req.body;
        //crear un registro de fichero
        const info = await newFichUp(ijob, idus, name);

        res.send({
            status: '200',
            message: `Fichero subido exitosamente con id: ${info[1]}`,
            job: info[0],
        })

    } catch(error) {
        next(error);
    }
};

//Marca trabajo como solucionado y fija la fecha del dia de la solucion
const solvJobController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const job = await solvJob(id);

        res.send({
            status: '200',
            message: `Trabajo con id: ${id}, solucionado`,
            job: job[0],
        })

    } catch(error) {
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
}