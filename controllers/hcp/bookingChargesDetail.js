const bookingChargesDetail = require('../../db_apis/hcp/bookingChargesDetail.js');

async function list(req, res, next) {
	console.log('controllers:bookingChargesDetail.list(req, res, next)');
	try {
		const rows = await bookingChargesDetail.list(req.user, req.query);
		rows.forEach((row) => {
			if (row.hoursCharged !== null && row.hoursCharged !== 0) {
				row.units = row.hoursCharged;
			} else if (row.shiftsCharged !== null && row.shiftsCharged !== 0) {
				row.units = row.shiftsCharged;
			} else if (row.kmsCharged !== null && row.kmsCharged !== 0) {
				row.units = row.kmsCharged;
				row.taskName = 'Travel';
				row.chargeRateDescription = 'Km';
			}
		});
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.list = list;
