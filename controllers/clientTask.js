const clientTask = require('../db_apis/clientTask.js');

async function getList(req, res, next) {
	console.log('controllers:clientTask.getList(req, res, next)');
	try {
		const rows = await clientTask.getList(req.user, req.params.clientId);
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.getList = getList;

async function get(req, res, next) {
	console.log('controllers:clientTask.get(req, res, next)');
	try {
		const id = parseInt(req.params.id);
		const rows = await clientTask.get(req.user, id);
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
	console.log('controllers:clientTask.update(req, res, next)');
	console.log(req.body);
	try {
		const id = parseInt(req.params.id);

		const result = await clientTask.update(req.user, id, req.body);
		//console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(201).send({
				success : 'true',
				message : 'Client Task updated successfully',
				//updatedClient,
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
	console.log('controllers:clientTask.insert(req, res, next)');
	try {
		req.body.clientId = parseInt(req.params.clientId);
		console.log(req.body);

		const result = await clientTask.insert(req.user, req.body);
		//console.log("result 1");
		console.log(result);
		//console.log("result 2");
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(201).send({
				success : 'true',
				message : 'Client Task inserted successfully',
				id      : result.recordset[0].id,
			});
		} else {
			res.status(404).end('200');
		}
	} catch (err) {
		return res
			.status(404)
			.send({
				success : false,
				message : err.stack,
			})
			.end('200');

		// console.error(err.stack);
		// next(err);
	}
}
module.exports.insert = insert;

async function remove(req, res, next) {
	console.log('controllers:clientTask.remove(req, res, next)');
	try {
		const id = parseInt(req.params.id);
		const result = await clientTask.remove(req.user, id);
		console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(200).send({
				success : true,
				message : 'Client Schedule deleted successfully',
				id      : result.recordset[0].id,
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
