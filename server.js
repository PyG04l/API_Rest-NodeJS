require('dotenv').config();

const express = require('express');
const morgan = require('morgan');


const {
    newUserController, getUserController, 
    loginController, changePassController,
    modifyUserController,
} = require('./controllers/users');

const {
    getServicesController, newServiceController,
    commentServiceController, getAllServsController,
    myComsController, uploadController,
    allGroupsCotroller, createGroupController,
    delIdGroupController, delAllGroupsController,
    getAllVallsController, createJobController,
    createValController, solvJobController,
} = require('./controllers/services');

const { authUser } = require('./middleware/midUser');
const { upload } = require('./middleware/midFile');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

//Rutas users
app.post('/user', newUserController); //crea usuario
app.post('/login', loginController); //loguea usuario
app.get('/user/:id', authUser, getUserController); //editar usuario
app.put('/modifyUser', authUser, modifyUserController); //Modifica el perfil del usuario
app.post('/chanPass', authUser, changePassController); //Cambia la contraseña del usuario

//Rutas servicios
app.get('/', getServicesController); //devolver lista de servicios
app.post('/createService', authUser, newServiceController); //crear nuevo servicio
app.get('/myServs/:id', authUser, getAllServsController); //devuelve todos los servicios de un usuario
app.post('/addCom', authUser, commentServiceController); //hacer comentarios a un servicio
app.get('/myComs/:id', authUser, myComsController); //devuelve lista de comentarios de un servicio
app.get('/seeGroups', authUser, allGroupsCotroller); //devuelve todos los grupos
app.post('/newGroup', authUser, createGroupController); //crea un nuevo grupo para los servicios
app.delete('/delIdGroup', authUser, delIdGroupController); //borrar un grupo por id
app.delete('/delAllGroups', authUser, delAllGroupsController); //borra todos los grupos
app.post('/uploadFile', authUser, authUser, upload, uploadController); //sube un archivo al servidor
app.get('/getAllVals/:id', authUser, getAllVallsController); //devuelve las valoraciones de un usuario
app.post('/newJob', authUser, createJobController); //crea un trabajo nuevo
app.post('/newVal', authUser, createValController); //crea una valoracion de un trabajo
app.put('/solved/:id', authUser, solvJobController); //Marca trabajo como resuelto


//404
app.use((req, res) => {
    res.status(404).send({
        status: 'error',
        message: 'Not found',
    });
});

//errores
app.use((error, req, res, next) => {
    console.log(error);

    res.status(error.httpStatus || 500).send({
        status: error.httpStatus,
        message: error.message,
    });
});

//lanzar server
app.listen(3000, () => {
    console.log('Servidor en marcha!');
})