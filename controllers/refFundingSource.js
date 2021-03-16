const refFundingSource = require('../db_apis/refFundingSource.js');

async function getList(req, res, next) {
	try {
		const rows = await refFundingSource.getList(req.user);
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.getList = getList;
