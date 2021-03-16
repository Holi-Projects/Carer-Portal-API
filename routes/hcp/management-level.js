var router = require('express').Router();

const { authJwt } = require('../../middleware');
const managementLevel = require('../../controllers/hcp/managementLevel.js');

router.route('/').all([ authJwt.verifyToken ]).get(managementLevel.list).post(managementLevel.insert);
router
	.route('/:id')
	.all([ authJwt.verifyToken ])
	.get(managementLevel.get)
	.put(managementLevel.update)
	.delete(managementLevel.remove);

module.exports = router;
