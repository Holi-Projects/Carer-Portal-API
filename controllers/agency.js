const agency = require('../db_apis/agency.js');

async function getList(req, res, next) {
	console.log('controllers:agency.getList(req, res, next)');
	console.log(req.user);
	try {
		const rows = await agency.getList(req.user, req.query);
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.getList = getList;

async function get(req, res, next) {
	console.log('controllers:agency.get(req, res, next)');
	try {
		const agencyId = parseInt(req.params.id, 10);
		console.log(agencyId);
		const rows = await agency.get(req.user, agencyId);
		// console.log(rows)
		// console.log(rows.length)
		if (rows.length === 1) {
			let agency = rows[0];

			// replace spaces in mobile numbers and let mask in FE control the presentation.
			agency.mobile && (agency.mobile = agency.mobile.replace(/\s+/g, ''));

			res.status(200).json(agency);
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
	console.log('controllers:agency.update(req, res, next)');
	console.log(req.body);
	try {
		const result = await agency.update(req.user, parseInt(req.params.id), req.body);
		//console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(201).send({
				success : 'true',
				message : 'Agency updated successfully',
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
	console.log('controllers:agency.insert(req, res, next)');
	try {
		console.log(req.body);

		const result = await agency.insert(req.user, req.body);
		//console.log(result);
		if (result.success) {
			return res.status(201).send(result);
		} else {
			res.status(422).send(result);
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.insert = insert;

async function remove(req, res, next) {
	console.log('controllers:agency.remove(req, res, next)');
	try {
		const result = await agency.remove(req.user, parseInt(req.params.id));
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(200).send({
				success : 'true',
				message : 'Agency deleted successfully',
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
