const router = require('express').Router();
const{
    getAllProjects,getProjectById,createProject,
    updateProject ,deleteProject,
} = require('../controllers/projectController');
const auth = require('../middelware/auth');
const upload = require('../middelware/upload');

//Public
router.get('/', getAllProjects);
router.get('/:id',getProjectById);

// Admin-protected
router.post('/' ,auth,upload.single('image'),createProject);
router.put('/:id',auth,upload.single('image'),updateProject);
router.delete('/:id', auth,deleteProject);

module.exports = router;