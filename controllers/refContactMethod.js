const refContactMethod = require('../db_apis/refContactMethod.js');

async function list(req, res, next) {
	try {
		// const rows = await refContactMethod.getRefContactMethod(req.user);
		const rows = await refContactMethod.list(req.user);

		for (const row of rows) row.contactMethod = row.contactMethod.trim();

		// console.log(rows)
		// console.log(rows.length)
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.list = list;
