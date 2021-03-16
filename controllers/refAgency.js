const refAgency = require('../db_apis/refAgency.js');

async function getRefAgency(req, res, next) {
	try {
		const rows = await refAgency.getRefAgency(req.user, req.query);
		// console.log(rows)
		// console.log(rows.length)
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.getRefAgency = getRefAgency;

async function list(req, res, next) {
	try {
		const rows = await refAgency.list(req.user, req.query);
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.list = list;
