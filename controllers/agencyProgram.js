const agencyProgram = require('../db_apis/agencyProgram.js');

async function getList(req, res, next) {
	try {
		//const agencyId = parseInt(req.query.agencyId);

		//const rows = await agencyProgram.getList(req.user, agencyId);
		const rows = await agencyProgram.getList(req.user);
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.getList = getList;

async function getAgencyPrograms(req, res, next) {
	try {
		const agencyId = parseInt(req.params.agencyId);

		const rows = await agencyProgram.getAgencyPrograms(req.user, agencyId);
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.getAgencyPrograms = getAgencyPrograms;

async function getAgencyProgram(req, res, next) {
	try {
		const programId = parseInt(req.params.programId);

		const rows = await agencyProgram.getAgencyProgram(req.user, programId);
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
module.exports.getAgencyProgram = getAgencyProgram;

async function updateAgencyProgram(req, res, next) {
	console.log('controllers:updateAgencyProgram(req, res, next)');
	try {
		const programId = parseInt(req.params.programId);
		console.log(req.body);

		const result = await agencyProgram.updateAgencyProgram(req.user, programId, req.body);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(200).send({
				success : 'true',
				message : 'Agency Program updated successfully',
			});
		} else {
			res.status(404).end('200');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.updateAgencyProgram = updateAgencyProgram;

async function addAgencyProgram(req, res, next) {
	console.log('controllers:addAgencyProgram(req, res, next)');
	try {
		const agencyId = parseInt(req.params.agencyId);
		req.body.agencyId = agencyId;

		console.log(req.body);
		const result = await agencyProgram.addAgencyProgram(req.user, req.body);
		//console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			newAgencyProgramId = result.recordset[0].id;
			return res.status(201).send({
				success : 'true',
				message : 'Agency Program inserted successfully',
				id      : newAgencyProgramId,
			});
		} else {
			res.status(404).end('200');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.addAgencyProgram = addAgencyProgram;

async function deleteAgencyProgram(req, res, next) {
	console.log('controllers:deleteAgencyProgram(req, res, next)');
	try {
		const agencyId = parseInt(req.params.agencyId);
		const programId = parseInt(req.params.programId);

		const result = await agencyProgram.deleteAgencyProgram(req.user, agencyId, programId);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			oldAgencyProgramId = result.recordset[0].id;
			return res.status(200).send({
				success : 'true',
				message : 'Agency Program deleted successfully',
				id      : oldAgencyProgramId,
			});
		} else {
			res.status(404).end('200');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.deleteAgencyProgram = deleteAgencyProgram;
