var router = require('express').Router();

const { authJwt } = require('../../middleware');
const supplementRate = require('../../controllers/hcp/supplementRate.js');

router.route('/').all([ authJwt.verifyToken ]).get(supplementRate.list).post(supplementRate.insert);
router
	.route('/:id')
	.all([ authJwt.verifyToken ])
	.get(supplementRate.get)
	.put(supplementRate.update)
	.delete(supplementRate.remove);

module.exports = router;
