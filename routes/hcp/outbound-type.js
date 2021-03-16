var router = require('express').Router();

const { authJwt } = require('../../middleware');
const outboundType = require('../../controllers/hcp/outboundType.js');

router.route('/').all([ authJwt.verifyToken ]).get(outboundType.list).post(outboundType.insert);
router
	.route('/:id')
	.all([ authJwt.verifyToken ])
	.get(outboundType.get)
	.put(outboundType.update)
	.delete(outboundType.remove);

module.exports = router;
