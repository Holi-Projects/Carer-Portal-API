var router = require('express').Router();

const { authJwt } = require('../../middleware');
const outboundTransaction = require('../../controllers/hcp/outboundTransaction.js');

router.route('/').all([ authJwt.verifyToken ]).get(outboundTransaction.list).post(outboundTransaction.insert);
router
	.route('/:id')
	.all([ authJwt.verifyToken ])
	.get(outboundTransaction.get)
	.put(outboundTransaction.update)
	.delete(outboundTransaction.remove);

module.exports = router;
