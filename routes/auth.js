var router = require('express').Router();

const { authJwt } = require('../middleware');
const auth = require('../controllers/auth');

router.route('/signin').post(auth.signin);
router.route('/change-password').put([ authJwt.verifyToken ], auth.changePassword);
router.route('/reset').post(auth.forgot);
router.route('/reset/:token').get(auth.checkResetToken).put(auth.resetPassword);

module.exports = router;
