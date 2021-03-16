var router = require('express').Router();

const { authJwt } = require('../middleware');

const agencyProgram = require('../controllers/agencyProgram.js');

router.route('/').get([ authJwt.verifyToken ], agencyProgram.getList);

module.exports = router;
