var router = require('express').Router();

const { authJwt } = require('../../middleware');
const administrativeFee = require('../../controllers/hcp/administrativeFee.js');

router.route('/').all([ authJwt.verifyToken ]).get(administrativeFee.list).post(administrativeFee.insert);
router
	.route('/:id')
	.all([ authJwt.verifyToken ])
	.get(administrativeFee.get)
	.put(administrativeFee.update)
	.delete(administrativeFee.remove);

module.exports = router;
