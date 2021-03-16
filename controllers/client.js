const client = require('../db_apis/client.js');
const phoneUtils = require('../utils/phoneUtils');

async function getClients(req, res, next) {
	try {
		const rows = await client.getClients(req.user, req.query);
		//console.log(rows);
		//console.log(rows.length);
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.getClients = getClients;

async function getClient(req, res, next) {
	try {
		const clientId = parseInt(req.params.id, 10);
		console.log(clientId);
		const rows = await client.getClient(req.user, clientId);
		// console.log(rows)
		// console.log(rows.length)
		if (rows.length === 1) {
			let client = rows[0];

			// replace spaces in phone numbers and let mask in FE control the presentation.
			client.homePhone = phoneUtils.formatPhoneDb2Api(client.homePhone);
			client.mobile = phoneUtils.formatPhoneDb2Api(client.mobile);
			client.businessPhone = phoneUtils.formatPhoneDb2Api(client.businessPhone);
			client.fax = phoneUtils.formatPhoneDb2Api(client.fax);

			res.status(200).json(client);
		} else {
			res.status(404).end('200');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.getClient = getClient;

async function updateClient(req, res, next) {
	console.log('controllers:updateClient(req, res, next)');
	try {
		const clientId = parseInt(req.params.id, 10);
		console.log(clientId);
		console.log(req.body);

		req.body.homePhone = phoneUtils.formatPhoneApi2Db(req.body.homePhone);
		req.body.mobile = phoneUtils.formatPhoneApi2Db(req.body.mobile);
		req.body.businessPhone = phoneUtils.formatPhoneApi2Db(req.body.businessPhone);
		req.body.fax = phoneUtils.formatPhoneApi2Db(req.body.fax);

		const result = await client.updateClient(req.user, clientId, req.body);
		//console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(201).send({
				success : 'true',
				message : 'Client updated successfully',
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

module.exports.updateClient = updateClient;

async function addClient(req, res, next) {
	console.log('controllers:addClient(req, res, next)');
	try {
		console.log(req.body);

		req.body.homePhone = phoneUtils.formatPhoneApi2Db(req.body.homePhone);
		req.body.mobile = phoneUtils.formatPhoneApi2Db(req.body.mobile);
		req.body.businessPhone = phoneUtils.formatPhoneApi2Db(req.body.businessPhone);
		req.body.fax = phoneUtils.formatPhoneApi2Db(req.body.fax);

		const result = await client.addClient(req.user, req.body);
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

module.exports.addClient = addClient;

async function getClientBirthdays(req, res, next) {
	console.log('Control:getClientBirthdays(req, res, next)');
	try {
		const rows = await client.getClientBirthdays(req.user, req.query);
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.getClientBirthdays = getClientBirthdays;

async function getClientChargesAllocations(req, res, next) {
	console.log('Control:getClientChargesAllocations(req, res, next)');
	try {
		const rows = await client.getClientChargesAllocations(req.user, req.query);
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.getClientChargesAllocations = getClientChargesAllocations;

async function getClientChargesAllocationsSummary(req, res, next) {
	console.log('Control:getClientChargesAllocationsSummary(req, res, next)');
	try {
		const rows = await client.getClientChargesAllocationsSummary(req.user, req.query);
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.getClientChargesAllocationsSummary = getClientChargesAllocationsSummary;
