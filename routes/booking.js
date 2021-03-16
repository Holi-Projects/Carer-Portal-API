var router = require('express').Router();
const booking = require('../controllers/booking.js');
const { authJwt } = require('../middleware');

router.route('/:id?/funding').get([ authJwt.verifyToken ], booking.getBookingFundings);
router.route('/:id?/payment').get([ authJwt.verifyToken ], booking.getBookingPayments);
router.route('/:id?/charge').get([ authJwt.verifyToken ], booking.getBookingCharges);
router.route('/:id').all([ authJwt.verifyToken ]).get(booking.getBookingDetails).put(booking.updateBooking);
router.route('/').get([ authJwt.verifyToken ], booking.getScheduledBooking);

module.exports = router;
