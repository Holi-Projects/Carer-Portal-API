const carerUnavailability = require('../db_apis/carerUnavailability.js');
const auditTrail = require('../db_apis/auditTrail.js');

async function getList(req, res, next) {
	console.log('controllers:carerUnavailability.get(req, res, next)');
	try {
		let carerId = parseInt(req.params.carerId);
		if (req.user.userType === 'carer') carerId = req.user.userId;

		const rows = await carerUnavailability.getList(req.user, carerId);
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.getList = getList;

async function list(req, res, next) {
	console.log('controllers:carerUnavailability.list(req, res, next)');
	try {
		let carerId = parseInt(req.params.carerId);
		if (req.user.userType === 'carer') carerId = req.user.userId;

		const rows = await carerUnavailability.list(req.user, carerId, req.query);
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.list = list;

async function get(req, res, next) {
	console.log('controllers:carerUnavailability.get(req, res, next)');
	try {
		let carerId = parseInt(req.params.carerId);
		if (req.user.userType === 'carer') carerId = req.user.userId;
		//console.log(carerId);
		const id = parseInt(req.params.id);

		const rows = await carerUnavailability.get(req.user, carerId, id);
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
	console.log('controllers:carerUnavailability.update(req, res, next)');
	console.log(req.body);
	try {
		let carerId = parseInt(req.params.carerId);
		if (req.user.userType === 'carer') carerId = parseInt(req.user.userId);
		const id = parseInt(req.params.id);
		//console.log(carerId);
		//console.log(id);

		// Deal with pseudo field 'unApprove' and clear approvedDate and approvedByEmployeeId
		if (req.body.unApprove !== undefined) {
			const { unApprove, ...body } = req.body;
			if (unApprove === true) {
				body.approvedDate = null;
				body.approvedByEmployeeId = null;
			}
			req.body = body;
		}

		const result = await carerUnavailability.update(req.user, carerId, id, req.body);
		//console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			// record insert in update trail
			const auditRec = {
				companyId    : req.user.companyId,
				carerId      : carerId,
				action       : `[Carers Unavailability] updated [CarerUnavailableSeqNo] = ${id}, data = ${JSON.stringify(
					req.body,
					null,
					2
				)}.`.substring(0, 255),
				actionSource : 'Carer-API:controllers:carerUnavailability.update()',
			};
			if (req.user.userType === 'employee') auditRec.employeeId = req.user.userId;
			const r = await auditTrail.insert(req.user, auditRec);

			return res.status(201).send({
				success : 'true',
				message : 'Carer Unavailability updated successfully',
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
	console.log('controllers:carerUnavailability.insert(req, res, next)');
	try {
		let carerId = parseInt(req.params.carerId);
		if (req.user.userType === 'carer') carerId = req.user.userId;

		req.body.carerId = parseInt(carerId);

		req.body.submittedDate = new Date().toISOString();

		console.log(req.body);

		const result = await carerUnavailability.insert(req.user, req.body);
		//console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			// record insert in audit trail
			const auditRec = {
				companyId    : req.user.companyId,
				carerId      : carerId,
				action       : `[Carers Unavailability] inserted [CarerUnavailableSeqNo] = ${result.recordset[0]
					.id}, data = ${JSON.stringify(req.body, null, 2)}.`.substring(0, 255),
				actionSource : 'Carer-API:controllers:carerUnavailability.insert()',
			};
			if (req.user.userType === 'employee') auditRec.employeeId = req.user.userId;
			const r = await auditTrail.insert(req.user, auditRec);

			return res.status(201).send({
				success : 'true',
				message : 'Carer Unavailability inserted successfully',
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
	console.log('controllers:carerUnavailability.remove(req, res, next)');
	try {
		let carerId = parseInt(req.params.carerId);
		if (req.user.userType === 'carer') carerId = parseInt(req.user.userId);

		const id = parseInt(req.params.id);

		const result = await carerUnavailability.remove(req.user, carerId, id);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			// record delete in audit trail
			const auditRec = {
				companyId    : req.user.companyId,
				carerId      : carerId,
				action       : `[Carers Unavailability] deleted [CarerUnavailableSeqNo] = ${id}.`,
				actionSource : 'Carer-API:controllers:carerUnavailability.remove()',
			};
			if (req.user.userType === 'employee') auditRec.employeeId = req.user.userId;
			const r = await auditTrail.insert(req.user, auditRec);

			return res.status(200).send({
				success : 'true',
				message : 'Carer Unavailability deleted successfully',
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
