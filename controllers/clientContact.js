const clientContact = require('../db_apis/clientContact.js');
const phoneUtils = require('../utils/phoneUtils');

async function getList(req, res, next) {
	console.log('controllers:clientContact.getList(req, res, next)');
	try {
		const rows = await clientContact.getList(req.user, req.params.clientId);

		rows.map((item) => {
			item.phone = phoneUtils.formatPhoneDb2Api(item.phone);
			item.mobile = phoneUtils.formatPhoneDb2Api(item.mobile);
		});

		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.getList = getList;

async function get(req, res, next) {
	console.log('controllers:clientContact.get(req, res, next)');
	try {
		const rows = await clientContact.get(req.user, req.params.clientId, req.params.id);

		rows.map((item) => {
			item.phone = phoneUtils.formatPhoneDb2Api(item.phone);
			item.mobile = phoneUtils.formatPhoneDb2Api(item.mobile);
		});

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
	console.log('controllers:clientContact.update(req, res, next)');
	console.log(req.body);
	try {
		if (req.body.phone) req.body.phone = phoneUtils.formatPhoneApi2Db(req.body.phone);
		if (req.body.mobile) req.body.mobile = phoneUtils.formatPhoneApi2Db(req.body.mobile);

		const result = await clientContact.update(req.user, req.params.clientId, req.params.id, req.body);
		//console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(201).send({
				success : 'true',
				message : 'Client Contact updated successfully',
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
	console.log('controllers:clientContact.insert(req, res, next)');
	try {
		let clientId = parseInt(req.params.clientId);
		req.body.clientId = parseInt(clientId);
		console.log(req.body);

		req.body.phone = phoneUtils.formatPhoneApi2Db(req.body.phone);
		req.body.mobile = phoneUtils.formatPhoneApi2Db(req.body.mobile);

		const result = await clientContact.insert(req.user, req.body);
		//console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(201).send({
				success : 'true',
				message : 'Client Contact inserted successfully',
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
	console.log('controllers:clientContact.remove(req, res, next)');
	try {
		const result = await clientContact.remove(req.user, req.params.clientId, req.params.id);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(200).send({
				success : 'true',
				message : 'Client Contact deleted successfully',
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
