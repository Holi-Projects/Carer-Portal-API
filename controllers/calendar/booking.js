const booking = require('../../db_apis/calendar/booking.js');
const carerUnavailability = require('../../db_apis/carerUnavailability');
const clientNotRequired = require('../../db_apis/clientNotRequired');


async function getList(req, res, next) {
	console.log('controllers:booking.getList(req, res, next)');
	try {
		const bookings = await booking.getList(req.user, req.query);
		const carerUnavailableEvents = await carerUnavailability.getList(req.user, null, req.query);
		const clientNotRequiredEvents = await clientNotRequired.list(req.user, req.query.clientId, req.query);

		let rows = bookings;
		if (carerUnavailableEvents !== undefined) rows = [...rows, ...carerUnavailableEvents]
		if (clientNotRequiredEvents !== undefined) rows = [...rows, ...clientNotRequiredEvents]

		//console.log(rows);
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.getList = getList;

async function get(req, res, next) {
	console.log('controllers:booking.get(req, res, next)');
	try {
		const id = parseInt(req.params.id);
		const rows = await booking.get(req.user, id);
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
module.exports.get = get;

async function update(req, res, next) {
	console.log('controllers:booking.update(req, res, next)');
	console.log(req.body);
	try {
		const result = await booking.update(req.user, req.body);
		//console.log(result);
		if (result.rowsAffected.length > 0) {
			// compound transaction, more than one statement may have been run
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
module.exports.update = update;

// async function insert(req, res, next) {
// 	console.log('controllers:clientSchedule.insert(req, res, next)');
// 	try {
// 		console.log(req.body);

// 		if (req.body.funding !== undefined)
// 			req.body.funding.forEach((item) => {
// 				if (item.percentageCharged !== undefined) {
// 					item.percentageCharged = parseFloat(item.percentageCharged) / 100;
// 				}
// 			});

// 		const result = await booking.insert(req.user, req.body);
// 		console.log('result 1');
// 		console.log(result);
// 		console.log('result 2');
// 		/*if (result.rowsAffected[0] === 1) {
// 			return res.status(201).send({
// 				success : 'true',
// 				message : 'Client Schedule inserted successfully',
// 				id      : result.recordset[0].id,
// 			});
// 		} else {
// 			res.status(404).end('200');
// 		}*/

// 		return res.status(201).send({
// 			success : 'true',
// 			message : 'Client Schedule inserted successfully',
// 			id      : result.recordset[0].id,
// 		});
// 	} catch (err) {
// 		console.error(err.stack);
// 		return res
// 			.status(404)
// 			.send({
// 				success : false,
// 				message : err.stack,
// 			})
// 			.end('200');

// 		// next(err);
// 	}
// }
// module.exports.insert = insert;

async function remove(req, res, next) {
	console.log('controllers:booking.remove(req, res, next)');
	try {
		const id = parseInt(req.params.id);
		const result = await booking.remove(req.user, id);
		console.log(result);
		//if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
		if (result.rowsAffected.length > 0) {
			// compound transaction, more than one statement may have been run
			return res.status(200).send({
				success : true,
				message : 'Booking deleted successfully',
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
