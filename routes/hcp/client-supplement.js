var router = require('express').Router();

const { authJwt } = require('../../middleware');
const clientSupplement = require('../../controllers/hcp/clientSupplement.js');

router.route('/').all([ authJwt.verifyToken ]).get(clientSupplement.list).post(clientSupplement.insert);
router
	.route('/:id')
	.all([ authJwt.verifyToken ])
	.get(clientSupplement.get)
	.put(clientSupplement.update)
	.delete(clientSupplement.remove);

module.exports = router;
