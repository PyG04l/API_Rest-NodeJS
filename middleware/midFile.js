const multer = require('multer');
const { getDateForm } = require('../helpers');


const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        const sqlDate = getDateForm();
        cb(null, `${req.idPropietario}_${sqlDate}_${file.originalname}`);
    }
});

const upload = multer({ storage: storage }).single('file');

module.exports = {
    upload,
};