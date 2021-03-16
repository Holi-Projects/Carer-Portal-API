const followup = require('../db_apis/followUp.js');

async function getFollowUps(req, res, next) {
	try {
		const filters = {};
		filters.employeeId = req.query.employeeId;
		filters.includeComplete = req.query.includeComplete;
		console.log(filters);

		const rows = await followup.getFollowUps(req.user, filters);
		// console.log(rows)
		// console.log(rows.length)

		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.getFollowUps = getFollowUps;
