var router = require('express').Router();

const { authJwt } = require('../../middleware');
const clientLeaveBooking = require('../../controllers/hcp/clientLeaveBooking.js');

router.route('/').all([ authJwt.verifyToken ]).get(clientLeaveBooking.list).post(clientLeaveBooking.insert);
router
	.route('/:id')
	.all([ authJwt.verifyToken ])
	.get(clientLeaveBooking.get)
	.put(clientLeaveBooking.update)
	.delete(clientLeaveBooking.remove);

module.exports = router;
