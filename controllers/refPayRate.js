const refPayRate = require('../db_apis/refPayRate.js');

async function list(req, res, next) {
	try {
		// const rows = await refPayRate.getRefPayRate(req.user);
		const rows = await refPayRate.list(req.user);

		for (const row of rows) {
			row.code = row.code.trim();
			row.unit = row.unit.trim();
		}

		// console.log(rows)
		// console.log(rows.length)
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.list = list;
