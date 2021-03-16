const agencyContact = require('../db_apis/agencyContact.js');

async function getList(req, res, next) {
	console.log('Control:agencyContact.getList(req, res, next)');
	try {
		const rows = await agencyContact.getList(req.user);
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.getList = getList;

async function getAgencyContacts(req, res, next) {
	console.log('Control:getAgencyContacts(req, res, next)');
	try {
		const rows = await agencyContact.getAgencyContacts(req.user, req.params.agencyId);
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.getAgencyContacts = getAgencyContacts;

async function getAgencyContact(req, res, next) {
	console.log('Control:getAgencyContact(req, res, next)');
	try {
		const rows = await agencyContact.getAgencyContact(req.user, req.params.agencyId, req.params.contactId);
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
module.exports.getAgencyContact = getAgencyContact;

async function updateAgencyContact(req, res, next) {
	console.log('controllers:updateAgencyContact(req, res, next)');
	try {
		const contactId = parseInt(req.params.contactId);
		console.log(req.body);

		const result = await agencyContact.updateAgencyContact(req.user, contactId, req.body);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(200).send({
				success : 'true',
				message : 'Agency Contact updated successfully',
			});
		} else {
			res.status(404).end('200');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.updateAgencyContact = updateAgencyContact;

async function addAgencyContact(req, res, next) {
	console.log('controllers:addAgencyContact(req, res, next)');
	try {
		req.body.agencyId = parseInt(req.params.agencyId);
		console.log(req.body);

		const result = await agencyContact.addAgencyContact(req.user, req.body);
		//console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			newAgencyContactId = result.recordset[0].id;
			return res.status(201).send({
				success : 'true',
				message : 'Agency Contact inserted successfully',
				id      : newAgencyContactId,
			});
		} else {
			res.status(404).end('200');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.addAgencyContact = addAgencyContact;

async function deleteAgencyContact(req, res, next) {
	console.log('controllers:deleteAgencyContact(req, res, next)');
	try {
		const agencyId = parseInt(req.params.agencyId);
		const contactId = parseInt(req.params.contactId);

		const result = await agencyContact.deleteAgencyContact(req.user, agencyId, contactId);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			oldAgencyContactId = result.recordset[0].id;
			return res.status(200).send({
				success : 'true',
				message : 'Agency Contact deleted successfully',
				id      : oldAgencyContactId,
			});
		} else {
			res.status(404).end('200');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.deleteAgencyContact = deleteAgencyContact;
