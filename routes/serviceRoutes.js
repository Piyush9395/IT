const router = require('express').Router();
const{
    getAllService , getServiceById, createService,
    updateService , deleteService,
} = require('../controllers/serviceController');
const auth = require('../middelware/auth');
const upload = require('../middelware/upload');

//Public
router.get('/',getAllService);
router.get('/:id',getServiceById);

//Admin-protected
router.post('/', auth,upload.single('image'),createService);
router.put('/:id',auth,upload.single('image'),updateService);
router.delete('/:id',auth,deleteService);

module.exports = router;