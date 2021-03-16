const refAddress = require('../db_apis/refAddress.js');

async function getRefAddress(req, res, next) {
	try {
		// const rows = await refAddress.getRefAddress();
		const queryParams = {};
		queryParams.state = req.query.state;
		queryParams.postcode = req.query.postcode;
		queryParams.locality = req.query.locality;
		queryParams.bspName = req.query.bspName;
		queryParams.selectOption = req.query.selectOption;


		const rows = await refAddress.getRefAddress(req.user, queryParams);
		console.log(queryParams);
		res.status(200).json(rows);

	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.getRefAddress = getRefAddress;
