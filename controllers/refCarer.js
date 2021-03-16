// const dbapi = require('../db_apis/refCarer');
const refCarer = require('../db_apis/refCarer');

async function getList(req, res, next) {
	console.log('Control:refCarer:getList(req, res, next)');
	try {
		res.status(200).json(await dbapi.getList(req.user));
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.getList = getList;

async function list(req, res, next) {
	console.log('Control:refCarer.list(req, res, next)');
	try {
		const rows = await refCarer.list(req.user);

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
