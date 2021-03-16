const refShiftType = require('../db_apis/refShiftType.js');

async function list(req, res, next) {
	//console.log('controllers:refShiftType.list(req, res, next)');
	try {
		const rows = await refShiftType.list(req.user);
		// console.log(rows)
		// console.log(rows.length)
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.list = list;

async function get(req, res, next) {
	//console.log('controllers:refShiftType.get(req, res, next)');
	try {
		const rows = await refShiftType.get(req.user, req.params.id);
		// console.log(rows)
		// console.log(rows.length)
		if (rows.length === 1) {
			res.status(200).json(rows[0]);
		} else {
			res.status(404).end('200');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.get = get;