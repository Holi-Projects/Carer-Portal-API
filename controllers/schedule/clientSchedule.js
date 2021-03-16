const clientSchedule = require('../../db_apis/schedule/clientSchedule.js');
const carersDays = require('../../db_apis/schedule/carersDays.js');
const clientScheduleFunding = require('../../db_apis/schedule/clientScheduleFunding.js');
const objectUtil = require('../../utils/objectUtil');

async function list(req, res, next) {
	console.log('controllers:clientSchedule.list(req, res, next)');
	try {
		const rows = await clientSchedule.list(req.user, req.query);

		for (let row of rows) {
			let workDays = [];
			if (row.Mon == 1) workDays.push('Mon');
			if (row.Tue == 1) workDays.push('Tue');
			if (row.Wed == 1) workDays.push('Wed');
			if (row.Thu == 1) workDays.push('Thu');
			if (row.Fri == 1) workDays.push('Fri');
			if (row.Sat == 1) workDays.push('Sat');
			if (row.Sun == 1) workDays.push('Sun');
			row.workDays = workDays.join(', ');
			let maxBookingDate = await clientSchedule.getMaxBookingDate(req.user, row.id);
			row.maxBookingDate = maxBookingDate.length === 1 ? maxBookingDate[0].maxBookingDate: null;
			//row.duration = row.duration/60;
		}
		// console.log(rows);
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.list = list;

async function get(req, res, next) {
	console.log('controllers:clientSchedule.get(req, res, next)');
	try {
		const id = parseInt(req.params.id);
		const rows = await clientSchedule.get(req.user, id);
		if (rows.length === 1) {
			const row = rows[0];

			let workDays = [];
			if (row.Mon == 1) workDays.push('Mon');
			if (row.Tue == 1) workDays.push('Tue');
			if (row.Wed == 1) workDays.push('Wed');
			if (row.Thu == 1) workDays.push('Thu');
			if (row.Fri == 1) workDays.push('Fri');
			if (row.Sat == 1) workDays.push('Sat');
			if (row.Sun == 1) workDays.push('Sun');
			row.workDays = workDays.join(', ');

			row.carerDays = await carersDays.getList(req.user, id);

			row.funding = await clientScheduleFunding.getList(req.user, id);

			row.funding.forEach((item) => {
				item.percentageCharged = item.percentageCharged * 100;
			});

			let maxBookingDate = await clientSchedule.getMaxBookingDate(req.user, row.id);
			row.maxBookingDate = maxBookingDate.length === 1 ? maxBookingDate[0].maxBookingDate: null;
			//row.duration = row.duration/60;
			res.status(200).json(row);
		} else {
			res.status(404).end('200');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.get = get;

async function update(req, res, next) {
	console.log('controllers:clientSchedule.update(req, res, next)');
	console.log(req.body);
	try {
		const id = parseInt(req.params.id);

		if (req.body.funding !== undefined)
			req.body.funding.forEach((item) => {
				if (item.data !== undefined) {
					if (item.data.percentageCharged !== undefined) {
						item.data.percentageCharged = parseFloat(item.data.percentageCharged) / 100;
					}
				}
			});

		const result = await clientSchedule.update(req.user, id, req.body);
		//console.log(result);
		if (result.rowsAffected.length > 0) {
			// compound transaction, more than one statement may have been run
			return res.status(200).send({
				success : 'true',
				message : 'Client Schedule updated successfully',
			});
		} else {
			res.status(404).end('200');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.update = update;

async function insert(req, res, next) {
	console.log('controllers:clientSchedule.insert(req, res, next)');
	try {
		console.log(req.body);

		if (req.body.funding !== undefined)
			req.body.funding.forEach((item) => {
				if (item.percentageCharged !== undefined) {
					item.percentageCharged = parseFloat(item.percentageCharged) / 100;
				}
			});

		const result = await clientSchedule.insert(req.user, req.body);
		console.log('result 1');
		console.log(result);
		console.log('result 2');
		/*if (result.rowsAffected[0] === 1) {
			return res.status(201).send({
				success : 'true',
				message : 'Client Schedule inserted successfully',
				id      : result.recordset[0].id,
			});
		} else {
			res.status(404).end('200');
		}*/

		return res.status(201).send({
			success : 'true',
			message : 'Client Schedule inserted successfully',
			id      : result.recordset[0].id,
		});
	} catch (err) {
		console.error(err.stack);
		return res
			.status(404)
			.send({
				success : false,
				message : err.stack,
			})
			.end('200');

		// next(err);
	}
}
module.exports.insert = insert;

async function remove(req, res, next) {
	console.log('controllers:clientSchedule.remove(req, res, next)');
	try {
		const id = parseInt(req.params.id);
		const result = await clientSchedule.remove(req.user, id);
		console.log(result);
		//if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
		if (result.rowsAffected.length > 0) {
			// compound transaction, more than one statement may have been run
			return res.status(200).send({
				success : true,
				message : 'Client Schedule deleted successfully',
				id      : result.recordset[result.recordset.length - 1].id,
			});
		} else {
			res.status(404).end('200');
		}
	} catch (err) {
		//console.error(err.stack);
		//	next(err);
		return res
			.status(404)
			.send({
				success : false,
				message : err.stack,
			})
			.end('200');
	}
}
module.exports.remove = remove;

async function populateSchedule(req, res, next) {
	console.log('controllers:clientSchedule.populateSchedule(req, res, next)');
	try {
		const id = parseInt(req.params.id);
		const result = await clientSchedule.populateSchedule(req.user, id, req.body);
		console.log(result);
		//if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
		if (result === 0) {
			// compound transaction, more than one statement may have been run
			return res.status(200).send({
				success : true,
				message : 'Client Schedule populated successfully',
				//id      : result.recordset[result.recordset.length - 1].id,
			});
		} else {
			res.status(404).end('200');
		}
	} catch (err) {
		//console.error(err.stack);
		//	next(err);
		return res
			.status(404)
			.send({
				success : false,
				message : err.stack,
			})
			.end('200');
	}
}
module.exports.populateSchedule = populateSchedule;

async function getNumberOfBookings(req, res, next) {
	console.log('controllers:booking.get(req, res, next)');
	try {
		const id = parseInt(req.params.id);
		const rows = await clientSchedule.getNumberOfBookings(req.user, id);
		console.log(rows)
		if (rows.length === 1) {
			res.status(200).json(rows[0]);
		} else {
			res.status(404).end('200');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.getNumberOfBookings = getNumberOfBookings;

async function clone(req, res, next) {
	console.log('controllers:booking.get(req, res, next)');
	try {
		const id = parseInt(req.params.id);
		const data = await get(req, res, next);
		console.log(data)
		if (objectUtil.isNull(data)) {
			const result = await clientSchedule.insert(req.user, data);
			console.log('result 1');
			console.log(result);
			console.log('result 2');
	
			return res.status(201).send({
				success : 'true',
				message : 'Client Schedule cloned successfully',
				id      : result.recordset[0].id,
			});
		} else {
			// res.status(404).end('200');
			return res
			.status(404)
			.send({
				success : false,
				message : 'Failed to fetch data',
			})
			.end('200');
		}
	} catch (err) {
		// console.error(err.stack);
		// next(err);

		console.error(err.stack);
		return res
			.status(404)
			.send({
				success : false,
				message : err.stack,
			})
			.end('200');
	}
}
module.exports.clone = clone;

async function getMaxBookingDate(req, res, next) {
	try {
		const clientScheduleSeqNo = req.params.id;
		console.log(clientScheduleSeqNo);
		const rows = await apis.getMaxBookingDate(req.user, clientScheduleSeqNo);
		if (rows.length === 1) {
			res.status(200).json(rows[0]);
		} else {
			res.status(404).end('200');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.getMaxBookingDate = getMaxBookingDate;
