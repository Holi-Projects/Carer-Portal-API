var router = require('express').Router();
const controller = require('../controllers/sms.js');
const { authJwt } = require('../middleware');

router.route('/').all([ authJwt.verifyToken ]).post(controller.sendSMS);
router.route('/reply').post(controller.receiveReply);

module.exports = router;
