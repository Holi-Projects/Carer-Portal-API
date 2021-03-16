const carerAvailability = require('../db_apis/carerAvailability.js');

async function getList(req, res, next) {
	console.log('controllers:carerAvailability.getList(req, res, next)');
	try {
		let carerId = parseInt(req.params.carerId);
		if (req.user.userType === 'carer') carerId = req.user.userId;
		//console.log(carerId);

		res.status(200).json(await carerAvailability.getList(req.user, carerId));
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.getList = getList;

async function get(req, res, next) {
	console.log('controllers:carerAvailability.get(req, res, next)');
	try {
		let carerId = parseInt(req.params.carerId);
		if (req.user.userType === 'carer') carerId = req.user.userId;
		//console.log(carerId);
		const id = parseInt(req.params.id);

		const rows = await carerAvailability.get(req.user, carerId, id);
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
	console.log('controllers:carerAvailability.update(req, res, next)');
	console.log(req.body);
	try {
		let carerId = parseInt(req.params.carerId);
		if (req.user.userType === 'carer') carerId = req.user.userId;
		//console.log(carerId);
		const id = parseInt(req.params.id);

		const result = await carerAvailability.update(req.user, carerId, id, req.body);
		//console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(201).send({
				success : 'true',
				message : 'Carer Availability updated successfully',
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
	console.log('controllers:carerAvailability.insert(req, res, next)');
	try {
		let carerId = parseInt(req.params.carerId);
		if (req.user.userType === 'carer') carerId = req.user.userId;
		//console.log(carerId);
		req.body.carerId = parseInt(carerId);
		console.log(req.body);

		const result = await carerAvailability.insert(req.user, req.body);
		//console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(201).send({
				success : 'true',
				message : 'Carer Availability inserted successfully',
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
	console.log('controllers:carerAvailability.remove(req, res, next)');
	try {
		let carerId = parseInt(req.params.carerId);
		if (req.user.userType === 'carer') carerId = req.user.userId;
		//console.log(carerId);
		const id = parseInt(req.params.id);

		const result = await carerAvailability.remove(req.user, carerId, id);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(200).send({
				success : 'true',
				message : 'Carer Availability deleted successfully',
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
