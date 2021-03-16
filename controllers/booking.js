const booking = require('../db_apis/booking.js');

async function getBookingDetails(req, res, next) {
	try {
		// const bookingId = req.params.id;
		console.log(req.user);
		const rows = await booking.getBookingDetails(req.user, req.params.id);
		// console.log(rows)
		// console.log(rows.length)
		if (rows.length === 1) {
			res.status(200).json(rows[0]);
		} else {
			res.status(404);
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.getBookingDetails = getBookingDetails;

async function getBookingFundings(req, res, next) {
	try {
		const rows = await booking.getBookingFundings(req.user, req.params.id);
		// console.log(rows)
		// console.log(rows.length)
		if (rows.length !== 0) {
			res.status(200).json(rows);
		} else {
			/* no data found */
			//   res.status(404).end('404');
			res.end('404');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.getBookingFundings = getBookingFundings;

async function getBookingPayments(req, res, next) {
	try {
		const rows = await booking.getBookingPayments(req.user, req.params.id);
		// console.log(rows)
		// console.log(rows.length)
		if (rows.length !== 0) {
			res.status(200).json(rows);
		} else {
			/* no data found */
			//   res.status(404).end('404');
			res.end('404');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.getBookingPayments = getBookingPayments;

async function getBookingCharges(req, res, next) {
	try {
		const bookingId = req.params.id;
		console.log(bookingId);
		const rows = await booking.getBookingCharges(req.user, req.params.id);
		// console.log(rows)
		// console.log(rows.length)
		if (rows.length !== 0) {
			res.status(200).json(rows);
		} else {
			/* no data found */
			//   res.status(404).end('404');
			res.end('404');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.getBookingCharges = getBookingCharges;

async function getScheduledBooking(req, res, next) {
	try {
		console.log(req.query);
		const rows = await booking.getScheduledBooking(req.user, req.query);
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.getScheduledBooking = getScheduledBooking;

async function updateBooking(req, res, next) {
	console.log('controllers:updateBooking(req, res, next)');
	try {
		const bookingId = parseInt(req.params.id, 10);
		console.log(bookingId);
		const bookingDetails = req.body;
		console.log(bookingDetails);

		if (bookingDetails.event) {
			switch (bookingDetails.event) {
				case 'carerShiftStart':
					bookingDetails.carerStartTime = bookingDetails.eventDateTime || new Date().toISOString();
					break;
				case 'carerShiftEnd':
					bookingDetails.carerEndTime = bookingDetails.eventDateTime || new Date().toISOString();
					break;
				case 'confirmShift':
					bookingDetails.confirmedDateTime = new Date().toISOString();
					break;
			}
		}

		const result = await booking.updateBooking(req.user, bookingId, bookingDetails);
		//console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(200).send({
				success : 'true',
				message : 'Booking updated successfully',
			});
		} else {
			res.status(404).end('200');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.updateBooking = updateBooking;
