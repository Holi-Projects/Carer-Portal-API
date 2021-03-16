const clientNotRequired = require('../db_apis/clientNotRequired');

async function list(req, res, next) {
	console.log('controllers:clientNotRequired.list(req, res, next)');
	try {
		let clientId = parseInt(req.params.clientId);
		const rows = await clientNotRequired.list(req.user, clientId, req.query);
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.list = list;

async function get(req, res, next) {
	console.log('controllers:clientNotRequired.get(req, res, next)');
	try {
		let clientId = parseInt(req.params.clientId);
		const id = parseInt(req.params.id);

		const rows = await clientNotRequired.get(req.user, clientId, id);
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
	console.log('controllers:clientNotRequired.update(req, res, next)');
	console.log(req.body);
	try {
		let clientId = parseInt(req.params.clientId);
		const id = parseInt(req.params.id);
        const result = await clientNotRequired.update(req.user, clientId, id, req.body);
		console.log(result.rowsAffected.length)
		console.log(result.rowsAffected[0])
        
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(201).send({
				success : true,
				message : 'Record updated successfully',
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
module.exports.update = update;

async function insert(req, res, next) {
	console.log('controllers:clientNotRequired.insert(req, res, next)');
	try {
		console.log(req.body);

		const result = await clientNotRequired.insert(req.user, req.body);
		//console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(201).send({
				success : 'true',
				message : 'Record inserted successfully',
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
	console.log('controllers:clientNotRequired.remove(req, res, next)');
	try {
		let clientId = parseInt(req.params.clientId);
		const id = parseInt(req.params.id);

		const result = await clientNotRequired.remove(req.user, clientId, id);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(200).send({
				success : 'true',
				message : 'Record deleted successfully',
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


async function isOverlapped(req, res, next) {
	console.log('controllers:clientNotRequired.isOverlapped(req, res, next)');
	try {
		let clientId = parseInt(req.params.clientId);
		const result = await clientNotRequired.isOverlapped(req.user, clientId, req.query);
		if (result.length > 0) {
			return res.status(200).send({
				result : true
			});
		} else {
			return res.status(200).send({
				result : false
			});
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.isOverlapped = isOverlapped;
