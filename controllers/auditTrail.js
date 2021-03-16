const auditTrail = require('../db_apis/auditTrail.js');

async function getList(req, res, next) {
	console.log('Control:auditTrail.getList(req, res, next)');
	try {
		const rows = await auditTrail.getList(req.user, req.query);
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.getList = getList;
