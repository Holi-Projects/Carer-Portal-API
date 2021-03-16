var router = require('express').Router();

const { authJwt } = require('../../middleware');
const clientContribution = require('../../controllers/hcp/clientContribution.js');

router.route('/').all([ authJwt.verifyToken ]).get(clientContribution.list).post(clientContribution.insert);
router
	.route('/:id')
	.all([ authJwt.verifyToken ])
	.get(clientContribution.get)
	.put(clientContribution.update)
	.delete(clientContribution.remove);

module.exports = router;
