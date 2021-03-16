var router = require('express').Router();
const clientSchedule = require('../controllers/schedule/clientSchedule.js');
const carersDays = require('../controllers/schedule/carersDays.js');
const { authJwt } = require('../middleware');

router.route('/:id?/carers-days').all([ authJwt.verifyToken ]).get(carersDays.getList).post(carersDays.insert);
// router.route('/:id?/funding').get([ authJwt.verifyToken ], standardService.getStdServiceFundings);
// router.route('/:id?/payment').get([ authJwt.verifyToken ], standardService.getStdServicePayments);
// router.route('/:id?/charge').get([ authJwt.verifyToken ], standardService.getStdServiceCharges);

router.route('/:id?/carers-days/:seqNo').all([ authJwt.verifyToken ]).put(carersDays.update);
//.delete([ authJwt.verifyToken ],carersDays.delete);

router.route('/:id/populate').all([ authJwt.verifyToken ]).post(clientSchedule.populateSchedule);

router
	.route('/:id')
	.all([ authJwt.verifyToken ])
	.get(clientSchedule.get)
	.put(clientSchedule.update)
	.delete(clientSchedule.remove);

router.route('/').all([ authJwt.verifyToken ]).get(clientSchedule.list).post(clientSchedule.insert);


router.route('/:id/number-of-bookings').all([ authJwt.verifyToken ]).get(clientSchedule.getNumberOfBookings);

router.route('/:id/clone').all([ authJwt.verifyToken ]).post(clientSchedule.clone);


module.exports = router;
