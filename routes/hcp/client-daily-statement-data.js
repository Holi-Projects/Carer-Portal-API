var router = require('express').Router();

const { authJwt } = require('../../middleware');
const clientDailyStatementData = require('../../controllers/hcp/clientDailyStatementData.js');

router
	.route('/')
	.all([ authJwt.verifyToken ])
	.get(clientDailyStatementData.list)
	.post(clientDailyStatementData.insert)
	.delete(clientDailyStatementData.removeBlock);

router
	.route('/:id')
	.all([ authJwt.verifyToken ])
	.get(clientDailyStatementData.get)
	.put(clientDailyStatementData.update)
	.delete(clientDailyStatementData.remove);

module.exports = router;
