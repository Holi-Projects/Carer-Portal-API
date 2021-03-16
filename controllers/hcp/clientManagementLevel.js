const clientManagementLevel = require('../../db_apis/hcp/clientManagementLevel.js');

async function list(req, res, next) {
	console.log('controllers:clientManagementLevel.list(req, res, next)');
	try {
		const rows = await clientManagementLevel.list(req.user, req.query);
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.list = list;

async function get(req, res, next) {
	console.log('controllers:clientManagementLevel.get(req, res, next)');
	try {
		const id = parseInt(req.params.id);

		const rows = await clientManagementLevel.get(req.user, id);
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
	console.log('controllers:clientManagementLevel.update(req, res, next)');
	console.log(req.body);
	try {
		const id = parseInt(req.params.id);

		const result = await clientManagementLevel.update(req.user, id, req.body);
		//console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(201).send({
				success : 'true',
				message : 'Client Management Level updated successfully',
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
	console.log('controllers:clientManagementLevel.insert(req, res, next)');
	try {
		const result = await clientManagementLevel.insert(req.user, req.body);
		//console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(201).send({
				success : 'true',
				message : 'Client Management Level inserted successfully',
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
	console.log('controllers:clientManagementLevel.remove(req, res, next)');
	try {
		const id = parseInt(req.params.id);

		const result = await clientManagementLevel.remove(req.user, id);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(200).send({
				success : 'true',
				message : 'Client Management Level deleted successfully',
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
