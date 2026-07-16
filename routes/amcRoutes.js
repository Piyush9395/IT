const router =  require('express').Router();
const {
  getAllAmc, getAmcById,
  createAmc, updateAmc, deleteAmc,
} = require('../controllers/amcController');

const auth = require('../middelware/auth');

// Public
router.get('/', getAllAmc);
router.get('/:id', getAmcById);

// Admin-protected
router.post('/', auth,createAmc);
router.put(':id', auth,updateAmc);
router.delete('/:id', auth,deleteAmc);

module.exports =router;