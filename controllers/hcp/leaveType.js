const leaveType = require('../../db_apis/hcp/leaveType.js');

async function list(req, res, next) {
	console.log('controllers:leaveType.list(req, res, next)');
	try {
		const rows = await leaveType.list(req.user, req.query);
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.list = list;

async function get(req, res, next) {
	console.log('controllers:leaveType.get(req, res, next)');
	try {
		const id = parseInt(req.params.id);

		const rows = await leaveType.get(req.user, id);
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
	console.log('controllers:leaveType.update(req, res, next)');
	console.log(req.body);
	try {
		const id = parseInt(req.params.id);

		const result = await leaveType.update(req.user, id, req.body);
		//console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(201).send({
				success : 'true',
				message : 'Leave Type updated successfully',
				//updatedContactHistory,
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
	console.log('controllers:leaveType.insert(req, res, next)');
	try {
		const result = await leaveType.insert(req.user, req.body);
		//console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(201).send({
				success : 'true',
				message : 'Leave Type inserted successfully',
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

async function remove(req, res, next) {
	console.log('controllers:leaveType.remove(req, res, next)');
	try {
		const id = parseInt(req.params.id);

		const result = await leaveType.remove(req.user, id);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(200).send({
				success : 'true',
				message : 'Leave Type deleted successfully',
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
