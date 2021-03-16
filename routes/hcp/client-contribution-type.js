var router = require('express').Router();

const { authJwt } = require('../../middleware');
const clientContributionType = require('../../controllers/hcp/clientContributionType.js');

router.route('/').all([ authJwt.verifyToken ]).get(clientContributionType.list).post(clientContributionType.insert);
router
	.route('/:id')
	.all([ authJwt.verifyToken ])
	.get(clientContributionType.get)
	.put(clientContributionType.update)
	.delete(clientContributionType.remove);

module.exports = router;
