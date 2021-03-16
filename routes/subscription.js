var router = require('express').Router();
const controller = require('../controllers/subscription.js');
const { authJwt } = require('../middleware');

router.route('/').all([ authJwt.verifyToken ]).post(controller.handlePushNotificationSubscription);
router.route('/:id').all([ authJwt.verifyToken ]).get(controller.sendPushNotification);

module.exports = router;
