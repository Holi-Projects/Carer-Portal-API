const carer = require('../db_apis/carer.js');
const dateTimeUtil = require('../utils/dateTimeUtil');

async function getCarers(req, res, next) {
	console.log('Control:getCarers(req, res, next)');
	try {
		const rows = await carer.getCarers(req.user, req.query);
		//if (rows.length !== 0) {
		res.status(200).json(rows);
		//} else {
		/* no data found */
		//   res.status(404).end('404');
		//	res.end('404');
		//}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.getCarers = getCarers;

async function getCarer(req, res, next) {
	console.log('Control:getCarer(req, res, next)');
	try {
		const rows = await carer.getCarer(req.user, req.params.id);

		if (rows.length === 1) {
			let carer = rows[0];

			if (carer.homePhone) {
				let phone = carer.homePhone.replace(/\s+/g, '');
				if (phone.length === 8) phone = `03${phone}`;
				carer.homePhone = phone;
			}
			carer.mobile && (carer.mobile = carer.mobile.replace(/\s+/g, ''));

			if (carer.emergencyPhone) {
				let phone = carer.emergencyPhone.replace(/\s+/g, '');
				if (phone.length === 8) phone = `03${phone}`;
				carer.emergencyPhone = phone;
			}
			carer.emergencyMobile && (carer.emergencyMobile = carer.emergencyMobile.replace(/\s+/g, ''));

			res.status(200).json(carer);
		} else {
			res.end('404');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.getCarer = getCarer;

async function getCarerLanguages(req, res, next) {
	console.log('Control:getCarerLanguages(req, res, next)');
	try {
		const rows = await carer.getCarerLanguages(req.user, req.params.id);

		//if (rows.length !== 0) {
		res.status(200).json(rows);
		//} else {
		/* no data found */
		//	res.end('404');
		//}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.getCarerLanguages = getCarerLanguages;

async function addCarer(req, res, next) {
	console.log('controllers:addCarer(req, res, next)');
	try {
		console.log(req.body);
		const result = await carer.addCarer(req.user, req.body);
		//console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			newCarerId = result.recordset[0].id;
			return res.status(201).send({
				success : 'true',
				message : 'Carer inserted successfully',
				id      : newCarerId,
			});
		} else {
			res.status(404).end('200');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.addCarer = addCarer;

async function updateCarer(req, res, next) {
	console.log('controllers:updateCarer(req, res, next)');
	try {
		const carerId = parseInt(req.params.id, 10);
		console.log(carerId);
		console.log(req.body);
		const result = await carer.updateCarer(req.user, carerId, req.body);
		//console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(201).send({
				success : 'true',
				message : 'Carer updated successfully',
				//updatedCarer,
			});
		} else {
			res.status(404).end('200');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.updateCarer = updateCarer;

async function updateCarerLanguages(req, res, next) {
	console.log('controllers:updateCarer(req, res, next)');
	try {
		const carerId = parseInt(req.params.id, 10);
		console.log(req.body);
		const result = await carer.updateCarerLanguages(req.user, carerId, req.body);
		//console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(201).send({
				success : 'true',
				message : 'Carer updated successfully',
				//updatedCarer,
			});
		} else {
			res.status(404).end('200');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.updateCarerLanguages = updateCarerLanguages;

async function getCarerUnavailable(req, res, next) {
	console.log('Control:getCarerUnavailable(req, res, next)');
	const DAY = 24 * 60 * 60 * 1000;
	try {
		let carerId = parseInt(req.params.carerId, 10);
		if (req.user.userType === 'carer') carerId = req.user.userId;
		console.log(carerId);

		const rows = await carer.getCarerUnavailable(req.user, carerId);
		rows.forEach((row) => {
			console.log(row);
			let startDate = row.startDate;
			let endDate = null;
			const startTime = row.startTime;
			const finishDate = row.finishDate;
			const endTime = row.endTime;

			// single whole day
			if (!finishDate && !startTime && !endTime) {
				console.log('single whole day');
				endDate = new Date(startDate.getTime() + DAY);
			} else if (!startTime && !endTime) {
				console.log('multiple whole days');
				endDate = new Date(finishDate.getTime() + DAY);
			} else if (!finishDate && startTime && endTime) {
				console.log('period within a day');
				startDate = new Date(startDate.getTime() + startTime.getTime() % DAY);
				endDate = new Date(startDate.getTime() + endTime.getTime() % DAY);
			} else if (finishDate && startTime && endTime) {
				console.log('multiple days + time');
				startDate = new Date(startDate.getTime() + startTime.getTime() % DAY);
				endDate = new Date(finishDate.getTime() + endTime.getTime() % DAY);
			} else {
				console.log('unrecognised date and time combination');
			}

			row.startDate = startDate;
			row.endDate = endDate;
		});

		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.getCarerUnavailable = getCarerUnavailable;

async function getCarerUnavailability(req, res, next) {
	console.log('Control:getCarerUnavailability(req, res, next)');
	try {
		let carerId = parseInt(req.params.carerId, 10);
		if (req.user.userType === 'carer') carerId = req.user.userId;
		console.log(carerId);
		const rows = await carer.getCarerUnavailability(req.user, carerId, req.query);

		//if (rows.length !== 0) {
		res.status(200).json(rows);
		//} else {
		/* no data found */
		//	res.end('404');
		//}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.getCarerUnavailability = getCarerUnavailability;

async function getCarerUnavailableDay(req, res, next) {
	console.log('Control:getCarerUnavailableDay(req, res, next)');
	try {
		let carerId = parseInt(req.params.carerId, 10);
		if (req.user.userType === 'carer') carerId = req.user.userId;
		console.log(carerId);
		const rows = await carer.getCarerUnavailableDay(req.user, carerId, req.query);
		res.status(200).json(dateTimeUtil.getEachDay(rows));
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.getCarerUnavailableDay = getCarerUnavailableDay;

/*async function addCarerUnavailable(req, res, next) {
	console.log('controllers:addCarerUnavailable(req, res, next)');
	try {
		const carerId = parseInt(req.params.carerId, 10);
		const result = await carer.addCarerUnavailable(req.user, req.body);
		//console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			newCarerId = result.recordset[0].id;
			return res.status(201).send({
				success : 'true',
				message : 'Carer Unavailable record inserted successfully',
				id      : newCarerId,
			});
		} else {
			res.status(404).end('200');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.addCarerUnavailable = addCarerUnavailable;

async function updateCarerUnavailable(req, res, next) {
	console.log('controllers:updateCarerUnavailable(req, res, next)');
	try {
		const carerId = parseInt(req.params.carerId, 10);
		console.log(carerId);
		const unavailableId = parseInt(req.params.id, 10);
		console.log(unavailableId);
		console.log(req.body);

		const result = await carer.updateCupdateCarerUnavailable(req.user, unavailableId, req.body);
		//console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(200).send({
				success : 'true',
				message : 'Carer Unavailable record updated successfully',
			});
		} else {
			res.status(404).end('200');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.updateCarerUnavailable = updateCarerUnavailable;

async function deleteCarerUnavailable(req, res, next) {
	console.log('controllers:deleteCarerUnavailable(req, res, next)');
	try {
		const carerId = parseInt(req.params.carerId, 10);
		console.log(carerId);
		const unavailableId = parseInt(req.params.id, 10);
		console.log(unavailableId);
		console.log(req.body);

		const result = await carer.deleteCarerUnavailable(req.user, unavailableId, req.body);
		//console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(200).send({
				success : 'true',
				message : 'Carer Unavailable record deleted successfully',
			});
		} else {
			res.status(404).end('200');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.deleteCarerUnavailable = deleteCarerUnavailable; */

async function getCarerBirthdays(req, res, next) {
	console.log('Control:getCarerBirthdays(req, res, next)');
	try {
		const rows = await carer.getCarerBirthdays(req.user, req.query);
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.getCarerBirthdays = getCarerBirthdays;

async function getCarerTimesheetsAllocations(req, res, next) {
	console.log('Control:getCarerTimesheetsAllocations(req, res, next)');
	try {
		const rows = await carer.getCarerTimesheetsAllocations(req.user, req.query);
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.getCarerTimesheetsAllocations = getCarerTimesheetsAllocations;
