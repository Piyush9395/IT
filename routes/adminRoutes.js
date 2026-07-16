const router = require('express').Router();
const { login , getProfile , changePassword , getDashboard} = require('../controllers/adminController');
const auth = require('../middelware/auth');

router.post('/login', login);
router.get('/profile', auth ,getProfile);
router.put('/change-password',auth,changePassword);
router.get('/dashboard',auth,getDashboard);

module.exports = router;