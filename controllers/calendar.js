const calendar = require('../db_apis/calendar.js');

async function getCalendar(req, res, next) {
	try {
		let carerId = parseInt(req.params.carerId, 10);
		if (req.user.userType === 'carer') carerId = req.user.userId;
		console.log(carerId);

		const responseObj = await calendar.getCalendar(req.user, carerId, req.query);

		res.status(200).json(responseObj);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.getCalendar = getCalendar;
