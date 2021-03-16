const refPricingGroup = require('../db_apis/refPricingGroup.js');

async function list(req, res, next) {
	try {
		// const rows = await refPricingGroup.getRefPricingGroup(req.user);
		const rows = await refPricingGroup.list(req.user);
		// console.log(rows)
		// console.log(rows.length)
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.list = list;
