var router = require('express').Router();

const { authJwt } = require('../../middleware');
const clientMonthlyStatement = require('../../controllers/hcp/clientMonthlyStatement.js');

//router.route('/').all([ authJwt.verifyToken ]).get(clientMonthlyStatement.list).post(clientMonthlyStatement.insert);
router
	.route('/')
	.all([ authJwt.verifyToken ])
	.get(clientMonthlyStatement.list)
	//.post(clientMonthlyStatement.createMonthlyStatements)
	.post(clientMonthlyStatement.createForClient)
	.delete(clientMonthlyStatement.removeBlock);

/*router
	.route('/:id')
	.all([ authJwt.verifyToken ])
	.get(clientMonthlyStatement.get)
	.put(clientMonthlyStatement.update)
	.delete(clientMonthlyStatement.remove);*/

module.exports = router;
