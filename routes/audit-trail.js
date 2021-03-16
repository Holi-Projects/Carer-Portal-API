var router = require('express').Router();

const { authJwt } = require('../middleware');

const auditTrail = require('../controllers/auditTrail.js');

router.route('/').get([ authJwt.verifyToken ], auditTrail.getList);

module.exports = router;
