const clientDailyStatementData = require('../../db_apis/hcp/clientDailyStatementData.js');
const clientLeaveBooking = require('../../db_apis/hcp/clientLeaveBooking.js');

async function list(req, res, next) {
	console.log('controllers:clientDailyStatementData.list(req, res, next)');
	try {
		const rows = await clientDailyStatementData.list(req.user, req.query);
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.list = list;

async function get(req, res, next) {
	console.log('controllers:clientDailyStatementData.get(req, res, next)');
	try {
		const id = parseInt(req.params.id);

		const rows = await clientDailyStatementData.get(req.user, id);
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
	console.log('controllers:clientDailyStatementData.update(req, res, next)');
	console.log(req.body);
	try {
		const id = parseInt(req.params.id);

		const result = await clientDailyStatementData.update(req.user, id, req.body);
		//console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(201).send({
				success : 'true',
				message : 'Client Daily Statement Data record updated successfully',
				//updatedHcpRate,
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
	console.log('controllers:clientDailyStatementData.insert(req, res, next)');
	try {
		const result = await clientDailyStatementData.insert(req.user, req.body);
		//console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(201).send({
				success : 'true',
				message : 'Client Daily Statement Data record inserted successfully',
				id      : result.recordset[0].id,
			});
		} else {
			res.status(404).end('200');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.insert = insert;

async function createForClient(req, res, next) {
	console.log('controllers:clientDailyStatementData.createForClient(req, res, next)');

	const clientId = req.body.clientId;
	const date = req.body.date;

	const row = {
		clientId : clientId,
		date     : date,
	};

	try {
		row.ratio = await clientLeaveBooking.ratio(req.user, clientId, date);
		row.hcpAmount = await clientHcp.amount(req.user, clientId, date);

		// Insert the new record
		const result = await clientDailyStatementData.insert(req.user, row);
		//console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return {
				success : 'true',
				message : 'Client Daily Statement Data record inserted successfully',
				//id      : result.recordset[0].id,
			};
		}
	} catch (err) {
		console.error(err.stack);
		//next(err);
	}
}
module.exports.createForClient = createForClient;

async function remove(req, res, next) {
	console.log('controllers:clientDailyStatementData.remove(req, res, next)');
	try {
		const id = parseInt(req.params.id);

		const result = await clientDailyStatementData.remove(req.user, id);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(200).send({
				success : 'true',
				message : 'Client Daily Statement Data record deleted successfully',
				id      : result.recordset[0].id,
			});
		} else {
			res.status(404).end('200');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.remove = remove;

async function removeBlock(req, res, next) {
	console.log('controllers:clientDailyStatementData.removeBlock(req, res, next)');
	console.log(req.body);
	try {
		const result = await clientDailyStatementData.removeBlock(
			req.user,
			req.body.year,
			req.body.month,
			req.body.clientId
		);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] >= 1) {
			return res.status(200).send({
				success : 'true',
				message : 'Client Daily Statement Data records deleted successfully',
				//id      : result.recordset[0].id,
			});
		} else {
			res.status(404).end('200');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.removeBlock = removeBlock;
