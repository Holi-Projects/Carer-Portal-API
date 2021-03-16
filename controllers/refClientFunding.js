const refClientFunding = require('../db_apis/refClientFunding.js');

async function getRefClientFunding(req, res, next) {
	try {
		const rows = await refClientFunding.getRefClientFunding(req.user, req.query);
		// console.log(rows)
		// console.log(rows.length)
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.getRefClientFunding = getRefClientFunding;
