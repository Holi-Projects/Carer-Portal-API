var router = require('express').Router();

const { authJwt } = require('../../middleware');
const clientInitialBalance = require('../../controllers/hcp/clientInitialBalance.js');

router.route('/').all([ authJwt.verifyToken ]).get(clientInitialBalance.list).post(clientInitialBalance.insert);
router
	.route('/:id')
	.all([ authJwt.verifyToken ])
	.get(clientInitialBalance.get)
	.put(clientInitialBalance.update)
	.delete(clientInitialBalance.remove);

module.exports = router;
