const incident = require('../db_apis/incident.js');

async function getList(req, res, next) {
	console.log('controllers:incident.getList(req, res, next)');
	try {
		if (req.user.userType === 'carer') req.query.carerId = req.user.userId;

		res.status(200).json(await incident.getList(req.user, req.query));
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.getList = getList;

async function get(req, res, next) {
	console.log('controllers:incident.get(req, res, next)');
	try {
		const id = parseInt(req.params.id);
		const rows = await incident.get(req.user, id);
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
	console.log('controllers:incident.update(req, res, next)');
	console.log(req.body);
	try {
		const id = parseInt(req.params.id);
		if (req.user.userType === 'carer') req.body.carerId = req.user.userId;
		console.log(req.body);

		const result = await incident.update(req.user, id, req.body);
		//console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(201).send({
				success : 'true',
				message : 'Incident updated successfully',
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
	console.log('controllers:incident.insert(req, res, next)');
	try {
		req.body.submittedDateTime = new Date().toISOString();
		if (req.user.userType === 'carer') req.body.carerId = req.user.userId;
		console.log(req.body);

		const result = await incident.insert(req.user, req.body);
		//console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(201).send({
				success : 'true',
				message : 'Incident inserted successfully',
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
	console.log('controllers:incident.remove(req, res, next)');
	try {
		const id = parseInt(req.params.id);
		const result = await incident.remove(req.user, id);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(200).send({
				success : 'true',
				message : 'Incident deleted successfully',
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
