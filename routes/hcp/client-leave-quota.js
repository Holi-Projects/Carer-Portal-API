var router = require('express').Router();

const { authJwt } = require('../../middleware');
const clientLeaveQuota = require('../../controllers/hcp/clientLeaveQuota.js');

router.route('/').all([ authJwt.verifyToken ]).get(clientLeaveQuota.list).post(clientLeaveQuota.insert);
router
	.route('/:id')
	.all([ authJwt.verifyToken ])
	.get(clientLeaveQuota.get)
	.put(clientLeaveQuota.update)
	.delete(clientLeaveQuota.remove);

module.exports = router;
