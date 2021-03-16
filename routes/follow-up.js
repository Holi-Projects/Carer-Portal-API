var router = require('express').Router();

const { authJwt } = require('../middleware');
const followUp = require('../controllers/followUp.js');

router.route('/').get([ authJwt.verifyToken ], followUp.getFollowUps); // supports query parameter employeeId

module.exports = router;
