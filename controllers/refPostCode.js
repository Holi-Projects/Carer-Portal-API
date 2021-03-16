const refPostCode = require('../db_apis/refPostCode.js');

async function getRefPostCodes(req, res, next) {
	try {
		const rows = await refPostCode.getRefPostCodes(req.user, req.query);
		// console.log(rows)
		// console.log(rows.length)
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.getRefPostCodes = getRefPostCodes;

async function getRefLocalities(req, res, next) {
	try {
		const rows = await refPostCode.getRefLocalities(req.user, req.query);
		console.log(rows);
		console.log(rows.length);
		localities = rows.map((value) => value.locality2);
		console.log(localities);
		res.status(200).json(localities);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.getRefLocalities = getRefLocalities;

async function getRefPostCode(req, res, next) {
	try {
		const id = parseInt(req.params.id, 10);
		console.log(id);
		const rows = await refPostCode.getRefPostCode(req.user, id);
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
module.exports.getRefPostCode = getRefPostCode;
