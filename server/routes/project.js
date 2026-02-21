const { Router } = require('express');
const authmware = require('../middlewares/authmware');
const { createProject } = require('../controllers/projectController');

const router = Router();

router.post('/', authmware, createProject);

module.exports = router;
