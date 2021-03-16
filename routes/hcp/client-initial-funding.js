var router = require('express').Router();

const { authJwt } = require('../../middleware');
const clientInitialFunding = require('../../controllers/hcp/clientInitialFunding.js');

router.route('/').all([ authJwt.verifyToken ]).get(clientInitialFunding.list).post(clientInitialFunding.insert);
router
	.route('/:id')
	.all([ authJwt.verifyToken ])
	.get(clientInitialFunding.get)
	.put(clientInitialFunding.update)
	.delete(clientInitialFunding.remove);

module.exports = router;
