const supplier = require('../../db_apis/hcp/supplier.js');

async function list(req, res, next) {
	console.log('controllers:supplier.list(req, res, next)');
	try {
		const rows = await supplier.list(req.user, req.query);
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.list = list;

async function get(req, res, next) {
	console.log('controllers:supplier.get(req, res, next)');
	try {
		const id = parseInt(req.params.id);

		const rows = await supplier.get(req.user, id);
		if (rows.length === 1) {
			let supplier = rows[0];

			// replace spaces in phone numbers and let mask in FE control the presentation.
			// TODO: supplier.phone = phoneUtils.formatPhoneDb2Api(supplier.phone);

			res.status(200).json(supplier);
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
	console.log('controllers:supplier.update(req, res, next)');
	console.log(req.body);
	try {
		const id = parseInt(req.params.id);

		const result = await supplier.update(req.user, id, req.body);
		//console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(201).send({
				success : 'true',
				message : 'Supplier updated successfully',
				//updatedSupplier,
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
	console.log('controllers:supplier.insert(req, res, next)');
	try {
		const result = await supplier.insert(req.user, req.body);
		//console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(201).send({
				success : 'true',
				message : 'Supplier inserted successfully',
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
	console.log('controllers:supplier.remove(req, res, next)');
	try {
		const id = parseInt(req.params.id);

		const result = await supplier.remove(req.user, id);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(200).send({
				success : 'true',
				message : 'Supplier deleted successfully',
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
