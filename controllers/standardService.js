const apis = require('../db_apis/standardService');

async function getStandardService(req, res, next) {
	try {
		const rows = await apis.getStandardService(req.user, req.query);
		res.status(200).json(rows);
		
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.getStandardService = getStandardService;


async function getStdServiceDetails(req, res, next) {
	try {
		const rows = await apis.getStdServiceDetails(req.user, req.params.id);
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

module.exports.getStdServiceDetails = getStdServiceDetails;

async function getStdServiceFundings(req, res, next) {
	try {
		const rows = await apis.getStdServiceFundings(req.user, req.params.id);
		if (rows.length !== 0) {
			res.status(200).json(rows);
		} else {
			/* no data found */
			res.end('404');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.getStdServiceFundings = getStdServiceFundings;

async function getStdServicePayments(req, res, next) {
	try {
		const rows = await apis.getStdServicePayments(req.user, req.params.id);
		if (rows.length !== 0) {
			res.status(200).json(rows);
		} else {
			/* no data found */
			res.end('404');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.getStdServicePayments = getStdServicePayments;

async function getStdServiceCharges(req, res, next) {
	try {
		const bookingId = req.params.id;
		console.log(bookingId);
		const rows = await apis.getStdServiceCharges(req.user, req.params.id);
		if (rows.length !== 0) {
			res.status(200).json(rows);
		} else {
			/* no data found */
			res.end('404');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.getStdServiceCharges = getStdServiceCharges;

async function getMaxBookingDate(req, res, next) {
	try {
		const clientScheduleSeqNo = req.params.id;
		console.log(clientScheduleSeqNo);
		const rows = await apis.getMaxBookingDate(req.user, clientScheduleSeqNo);
		if (rows.length !== 0) {
			res.status(200).json(rows);
		} else {
			/* no data found */
			res.end('404');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.getMaxBookingDate = getMaxBookingDate;

