var router = require('express').Router();

const { authJwt } = require('../../middleware');
const statement = require('../../controllers/hcp/statement.js');

router.route('/client').all([ authJwt.verifyToken ]).get(statement.getClient);

router
	.route('/dailydata')
	.all([ authJwt.verifyToken ]) //.post(statement.storeDailyStatementData)
	.get(statement.retrieveStatementData)
	.post(statement.createDailyData)
	.delete(statement.deleteDailyStatement);

router.route('/update-statement-data').all([ authJwt.verifyToken ]).put(statement.updateStatementData);

router
	.route('/monthlydata')
	.all([ authJwt.verifyToken ])
	.get(statement.getMonthlyStatement)
	.post(statement.createMonthlyStatement)
	.delete(statement.deleteMonthlyStatement);

//////////////////////////////////////

//router.route('/statementdata/:type?/:startDate?/:endDate?/:id?').get(statement.getStatementData);

module.exports = router;
