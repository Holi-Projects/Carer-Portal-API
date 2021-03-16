var router = require('express').Router();

const { authJwt } = require('../../middleware');
const bookingChargesDetail = require('../../controllers/hcp/bookingChargesDetail.js');

router.route('/').all([ authJwt.verifyToken ]).get(bookingChargesDetail.list); //.post(bookingChargesDetail.insert);
/*router
	.route('/:id')
	.all([ authJwt.verifyToken ])
	.get(bookingChargesDetail.get)
	.put(bookingChargesDetail.update)
	.delete(bookingChargesDetail.remove);*/

module.exports = router;
