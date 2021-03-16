const employee = require('../db_apis/employee.js');

async function list(req, res, next) {
	console.log('controllers:employee.getList(req, res, next)');
	try {
		const rows = await employee.list(req.user, req.query);
		//console.log(rows);
		//console.log(rows.data.length);

		for (row of rows.data) {
			if (row.mobile) {
				row.mobile = row.mobile.replace(/\s+/g, '');
				if (row.mobile.length === 10) {
					row.mobileDisplay =
						row.mobile.substring(0, 4) + ' ' + row.mobile.substring(4, 7) + ' ' + row.mobile.substring(7);
				}
			}
			if (row.homePhone) {
				let phone = row.homePhone.replace(/\s+/g, '');
				if (phone.length === 8) phone = `03${phone}`;
				row.homePhone = phone;
			}
			if (row.businessPhone) {
				let phone = row.businessPhone.replace(/\s+/g, '');
				if (phone.length === 8) phone = `03${phone}`;
				row.businessPhone = phone;
			}
			if (row.fax) {
				let phone = row.fax.replace(/\s+/g, '');
				if (phone.length === 8) phone = `03${phone}`;
				row.fax = phone;
			}
		}
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.list = list;

async function get(req, res, next) {
	console.log('controllers:employee.get(req, res, next)');
	try {
		const rows = await employee.get(req.user, parseInt(req.params.id));
		// console.log(rows)
		// console.log(rows.length)
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
	console.log('controllers:employee.update(req, res, next)');
	console.log(req.body);
	try {
		const result = await employee.update(req.user, parseInt(req.params.id), req.body);
		//console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(201).send({
				success : 'true',
				message : 'Employee updated successfully',
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
	console.log('controllers:employee.insert(req, res, next)');
	try {
		console.log(req.body);

		const result = await employee.insert(req.user, req.body);
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
	console.log('controllers:employee.remove(req, res, next)');
	try {
		const result = await employee.remove(req.user, parseInt(req.params.id));
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(200).send({
				success : 'true',
				message : 'Employee deleted successfully',
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
