var router = require('express').Router();

const { authJwt } = require('../../middleware');
const clientAdminFee = require('../../controllers/hcp/clientAdminFee.js');

router.route('/').all([ authJwt.verifyToken ]).get(clientAdminFee.list).post(clientAdminFee.insert);
router
	.route('/:id')
	.all([ authJwt.verifyToken ])
	.get(clientAdminFee.get)
	.put(clientAdminFee.update)
	.delete(clientAdminFee.remove);

module.exports = router;
