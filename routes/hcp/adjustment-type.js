var router = require('express').Router();

const { authJwt } = require('../../middleware');
const adjustmentType = require('../../controllers/hcp/adjustmentType.js');

router.route('/').all([ authJwt.verifyToken ]).get(adjustmentType.list).post(adjustmentType.insert);
router
	.route('/:id')
	.all([ authJwt.verifyToken ])
	.get(adjustmentType.get)
	.put(adjustmentType.update)
	.delete(adjustmentType.remove);

module.exports = router;
