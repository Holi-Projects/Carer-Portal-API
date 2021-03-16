var router = require('express').Router();
const standardService = require('../controllers/standardService.js');
const carersDays = require('../controllers/schedule/carersDays.js');
const clientScheduleFunding = require('../controllers/schedule/clientScheduleFunding.js');
const { authJwt } = require('../middleware');

router.route('/:id?/carers-days').get([ authJwt.verifyToken ], carersDays.getList);
router.route('/:id?/funding').get([ authJwt.verifyToken ], standardService.getStdServiceFundings);
router.route('/:id?/funding2').get([ authJwt.verifyToken ], clientScheduleFunding.getList);
router.route('/:id?/payment').get([ authJwt.verifyToken ], standardService.getStdServicePayments);
router.route('/:id?/charge').get([ authJwt.verifyToken ], standardService.getStdServiceCharges);
router.route('/:id?/max-booking-date').get([ authJwt.verifyToken ], standardService.getMaxBookingDate);
router.route('/:id').get([ authJwt.verifyToken ], standardService.getStdServiceDetails);
router.route('/').get([ authJwt.verifyToken ], standardService.getStandardService);

module.exports = router;
