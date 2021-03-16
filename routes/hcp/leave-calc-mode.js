var router = require('express').Router();

const { authJwt } = require('../../middleware');
const leaveCalcMode = require('../../controllers/hcp/leaveCalcMode.js');

router.route('/').all([ authJwt.verifyToken ]).get(leaveCalcMode.list).post(leaveCalcMode.insert);
router
	.route('/:id')
	.all([ authJwt.verifyToken ])
	.get(leaveCalcMode.get)
	.put(leaveCalcMode.update)
	.delete(leaveCalcMode.remove);

module.exports = router;
