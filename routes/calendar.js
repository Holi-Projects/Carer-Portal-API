var router = require('express').Router();
const booking = require('../controllers/calendar/booking.js');
const { authJwt } = require('../middleware');

router
	.route('/:id')
	.all([ authJwt.verifyToken ])
	.get(booking.get)
	.delete(booking.remove);

router.route('/')
    .all([ authJwt.verifyToken ])
    .get(booking.getList)
    .put(booking.update)
    // .post(booking.insert);

module.exports = router;
