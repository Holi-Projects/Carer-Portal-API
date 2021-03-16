const clientBudget = require('../../db_apis/hcp/clientBudget.js');
const clientInitialBalance = require('../../db_apis/hcp/clientInitialBalance.js');
const clientInitialFunding = require('../../db_apis/hcp/clientInitialFunding.js');
const clientInitialExpenditure = require('../../db_apis/hcp/clientInitialExpenditure.js');

/*async function list(req, res, next) {
	console.log('controllers:clientBudget.list(req, res, next)');
	try {
		const rows = await clientBudget.list(req.user, req.query);
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.list = list;*/

async function get(req, res, next) {
	console.log('controllers:clientBudget.get(req, res, next)');
	try {
		const id = parseInt(req.params.id);
		const query = { clientId: id };

		const budget = {};

		const balanceRows = await clientInitialBalance.list(req.user, query);
		const fundingRows = await clientInitialFunding.list(req.user, query);
		const expenditureRows = await clientInitialExpenditure.list(req.user, query);

		if (balanceRows.length === 1 && fundingRows.length === 2 && expenditureRows.length === 3) {
			budget.date = balanceRows[0].date;

			budget.initialBalance = {
				government : balanceRows[0].governmentPortion,
				client     : balanceRows[0].clientPortion,
				total      : balanceRows[0].amount,
				note       : balanceRows[0].note,
			};

			const governmentFundingRows = fundingRows.filter((row) => row.inboundId === 1);
			const clientFundingRows = fundingRows.filter((row) => row.inboundId === 2);
			if (governmentFundingRows.length === 1 && clientFundingRows.length === 1) {
				budget.initialFunding = {
					government : {
						received    : governmentFundingRows[0].receivedAmount,
						notReceived : governmentFundingRows[0].notReceivedAmount,
						total       : governmentFundingRows[0].amount,
					},
					client     : {
						received    : clientFundingRows[0].receivedAmount,
						notReceived : clientFundingRows[0].notReceivedAmount,
						total       : clientFundingRows[0].amount,
					},
					total      : governmentFundingRows[0].amount + clientFundingRows[0].amount,
				};
			}

			const servicesExpenditureRows = expenditureRows.filter((row) => row.outboundId === 1);
			const administationExpenditureRows = expenditureRows.filter((row) => row.outboundId === 2);
			const advisoryExpenditureRows = expenditureRows.filter((row) => row.outboundId === 3);
			if (
				servicesExpenditureRows.length === 1 &&
				administationExpenditureRows.length === 1 &&
				advisoryExpenditureRows.length === 1
			) {
				budget.initialExpenditure = {
					services       : servicesExpenditureRows[0].amount,
					administration : administationExpenditureRows[0].amount,
					advisory       : advisoryExpenditureRows[0].amount,
					total          :
						servicesExpenditureRows[0].amount +
						administationExpenditureRows[0].amount +
						advisoryExpenditureRows[0].amount,
				};
			}

			res.status(200).json(budget);
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
	console.log('controllers:clientBudget.update(req, res, next)');
	console.log(req.body);
	try {
		const id = parseInt(req.params.id);

		const result = await clientBudget.update(req.user, id, req.body);
		console.log(result);
		if (result.rowsAffected.length === 6 && result.rowsAffected[0] === 1) {
			return res.status(201).send({
				success : 'true',
				message : 'Client Budget updated successfully',
				//updatedHcpRate,
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

/*async function insert(req, res, next) {
	console.log('controllers:clientBudget.insert(req, res, next)');
	try {
		const result = await clientBudget.insert(req.user, req.body);
		//console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(201).send({
				success : 'true',
				message : 'Client HCP inserted successfully',
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
	console.log('controllers:clientBudget.remove(req, res, next)');
	try {
		const id = parseInt(req.params.id);

		const result = await clientBudget.remove(req.user, id);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(200).send({
				success : 'true',
				message : 'Client HCP deleted successfully',
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
module.exports.remove = remove;*/
