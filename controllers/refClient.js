const dbapi = require('../db_apis/refClient');
const refClient = require('../db_apis/refClient');

async function getRefClient(req, res, next) {
	console.log('Control:getRefClient(req, res, next)');
	try {
		//const context = {};
		//context.toDate = req.query.toDate;
		// console.log(context)
		res.status(200).json(await dbapi.getRefClient(req.user, req.query));
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.getRefClient = getRefClient;

async function list(req, res, next) {
	console.log('Control:refClient.list(req, res, next)');
	try {
		const rows = await refClient.list(req.user, req.query);

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
