var router = require('express').Router();

const { authJwt } = require('../../middleware');
const inboundType = require('../../controllers/hcp/inboundType.js');

router.route('/').all([ authJwt.verifyToken ]).get(inboundType.list).post(inboundType.insert);
router
	.route('/:id')
	.all([ authJwt.verifyToken ])
	.get(inboundType.get)
	.put(inboundType.update)
	.delete(inboundType.remove);

module.exports = router;
