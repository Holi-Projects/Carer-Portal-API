const refHoliday = require('../db_apis/refHoliday.js');

async function list(req, res, next) {
	try {
		// const year = req.query.year;
		// const rows = await refHoliday.getRefHoliday(req.user, year);

		const rows = await refHoliday.list(req.user, req.query);

		// console.log(rows)
		// console.log(rows.length)
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.list = list;
