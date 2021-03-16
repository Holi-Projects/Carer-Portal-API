const fundingArrangement = require('../db_apis/fundingArrangement.js');
const phoneUtils = require('../utils/phoneUtils');
const fundingArrangementTask = require('../db_apis/fundingArrangementTask.js');

async function getFundingArrangements(req, res, next) {
	console.log('Control:getFundingArrangements(req, res, next)');
	try {
		// either clientId or agencyId must be supplied
		if (!req.query.clientId && !req.query.agencyId) {
			return res.status(200).send({
				message : 'Either clientId or agencyId must be supplied',
			});
		}

		const rows = await fundingArrangement.getFundingArrangements(req.user, req.query);

		rows.map((item) => {
			item.agencyContactPhone = phoneUtils.formatPhoneDb2Api(item.agencyContactPhone);
			item.agencyContactMobile = phoneUtils.formatPhoneDb2Api(item.agencyContactMobile);
		});

		for (item of rows) {
			item.tasks = [];
			const taskRecords = await fundingArrangementTask.getList(req.user, item.id);
			for (record of taskRecords) {
				item.tasks.push(record.taskId);
			}
		}

		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.getFundingArrangements = getFundingArrangements;

async function getFundingArrangement(req, res, next) {
	try {
		const fundingArrangementId = parseInt(req.params.fundingArrangementId);

		const rows = await fundingArrangement.getFundingArrangement(req.user, fundingArrangementId);
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
module.exports.getFundingArrangement = getFundingArrangement;

async function updateFundingArrangement(req, res, next) {
	console.log('controllers:updateFundingArrangement(req, res, next)');
	try {
		const fundingArrangementId = parseInt(req.params.fundingArrangementId);
		console.log(req.body);

		const result = await fundingArrangement.updateFundingArrangement(req.user, fundingArrangementId, req.body);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(200).send({
				success : 'true',
				message : 'Funding Arrangement updated successfully',
			});
		} else {
			res.status(404).end('200');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.updateFundingArrangement = updateFundingArrangement;

async function addFundingArrangement(req, res, next) {
	console.log('controllers:addFundingArrangement(req, res, next)');
	try {
		console.log(req.body);

		const result = await fundingArrangement.addFundingArrangement(req.user, req.body);
		//console.log(result);
		if (result.rowsAffected && result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			newFundingArrangementId = result.recordset[0].id;
			return res.status(201).send({
				success : 'true',
				message : 'Funding Arrangement inserted successfully',
				id      : newFundingArrangementId,
			});
		} else {
			// TODO: need to communicate error back
			res.status(404).end('200');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.addFundingArrangement = addFundingArrangement;

async function deleteFundingArrangement(req, res, next) {
	console.log('controllers:deleteFundingArrangement(req, res, next)');
	try {
		const fundingArrangementId = parseInt(req.params.fundingArrangementId);

		const result = await fundingArrangement.deleteFundingArrangement(req.user, fundingArrangementId);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			oldFundingArrangementId = result.recordset[0].id;
			return res.status(200).send({
				success : 'true',
				message : 'Funding Arrangement deleted successfully',
				id      : oldFundingArrangementId,
			});
		} else {
			res.status(404).end('200');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.deleteFundingArrangement = deleteFundingArrangement;
