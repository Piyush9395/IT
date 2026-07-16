const Router = require('express').Router();
const {
    submitContact , getAllContacts , getContactById , deleteContact,
} = require('../controllers/contactController');
const auth = require('../middelware/auth');
const router = require('./adminRoutes');
const { route } = require('./adminRoutes');

// Public — contact form submission
router.post('/', submitContact);

// Admin-protected
router.get('/', auth,getAllContacts);
router.get('/:id',auth,getContactById);
router.delete('/:id',auth,deleteContact);

module.exports = router;