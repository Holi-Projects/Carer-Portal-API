var router = require('express').Router();

const { authJwt } = require('../../middleware');
const clientAdjustmentBalance = require('../../controllers/hcp/clientAdjustmentBalance.js');

router.route('/').all([ authJwt.verifyToken ]).get(clientAdjustmentBalance.list).post(clientAdjustmentBalance.insert);
router
	.route('/:id')
	.all([ authJwt.verifyToken ])
	.get(clientAdjustmentBalance.get)
	.put(clientAdjustmentBalance.update)
	.delete(clientAdjustmentBalance.remove);

module.exports = router;
