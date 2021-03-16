var router = require('express').Router();

const { authJwt } = require('../middleware');

const agencyContact = require('../controllers/agencyContact.js');

router.route('/').get([ authJwt.verifyToken ], agencyContact.getList);

module.exports = router;
