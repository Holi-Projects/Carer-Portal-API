var router = require('express').Router();

const { authJwt } = require('../../middleware');
const inboundTransaction = require('../../controllers/hcp/inboundTransaction.js');

router.route('/').all([ authJwt.verifyToken ]).get(inboundTransaction.list).post(inboundTransaction.insert);
router
	.route('/:id')
	.all([ authJwt.verifyToken ])
	.get(inboundTransaction.get)
	.put(inboundTransaction.update)
	.delete(inboundTransaction.remove);

module.exports = router;
