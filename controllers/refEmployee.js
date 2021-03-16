const refEmployee = require('../db_apis/refEmployee.js');

async function getRefEmployee(req, res, next) {
	try {
		res.status(200).json(await refEmployee.getRefEmployee(req.user));
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.getRefEmployee = getRefEmployee;

async function list(req, res, next) {
	try {
		const rows = await refEmployee.list(req.user);

		for (const row of rows) {
			row.name = row.firstName + ' ' + row.lastName;
			row.name2 = row.lastName + ', ' + row.firstName;
		}

		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.list = list;
