const pdf = require('html-pdf');
const path = require('path');
const fs = require('fs');

const client = require('../../db_apis/client.js');
const clientMonthlyStatement = require('../../db_apis/hcp/clientMonthlyStatement.js');
const clientDailyStatementData = require('../../db_apis/hcp/clientDailyStatementData.js');
const clientInitialBalance = require('../../db_apis/hcp/clientInitialBalance.js');
const inboundTransaction = require('../../db_apis/hcp/inboundTransaction.js');

const pdfTemplate = require('../../documents/template.js');
const tools = require('../../utils/tools.js');
const statement = require('../../db_apis/hcp/statement.js');
//const srvdetail = require('../../db_apis/hcp/srvdetail.js');

async function list(req, res, next) {
	console.log('controllers:clientMonthlyStatement.list(req, res, next)');
	try {
		const rows = await clientMonthlyStatement.list(req.user, req.query);
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.list = list;

async function get(req, res, next) {
	console.log('controllers:clientMonthlyStatement.get(req, res, next)');
	try {
		const id = parseInt(req.params.id);

		const rows = await clientMonthlyStatement.get(req.user, id);
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
	console.log('controllers:clientMonthlyStatement.update(req, res, next)');
	console.log(req.body);
	try {
		const id = parseInt(req.params.id);

		const result = await clientMonthlyStatement.update(req.user, id, req.body);
		//console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(201).send({
				success : 'true',
				message : 'Client Monthly Statement record updated successfully',
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

async function insert(req, res, next) {
	console.log('controllers:clientMonthlyStatement.insert(req, res, next)');
	try {
		const result = await clientMonthlyStatement.insert(req.user, req.body);
		//console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(201).send({
				success : 'true',
				message : 'Client Monthly Statement record inserted successfully',
				//id      : result.recordset[0].id,
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

async function createForClient(req, res, next) {
	console.log('controllers:clientMonthlyStatement.createForClient(req, res, next)');

	const clientId = req.body.clientId;
	const year = req.body.year;
	const month = req.body.month;

	try {
		let rows = await clientDailyStatementData.summary(req.user, clientId, year, month);
		if (rows.length === 1) {
			const stmt = rows[0]; // initialise new row with summary of daily data

			// Determine the opening balance
			stmt.openBalance = 0.0;
			rows = await clientMonthlyStatement.previousBalance(req.user, clientId, year, month);
			if (rows.length === 1) {
				stmt.openBalance = rows[0].closeBalance;
			} else {
				rows = await clientInitialBalance.summary(req.user, clientId);
				if (rows.length === 1) {
					stmt.openBalance = rows[0].initialBalance;
				}
			}

			console.log(stmt);
			// Determnine closing balance
			stmt.totalFunding =
				tools.roundUp(stmt.governmentSubsidy) +
				tools.roundUp(stmt.suppSubsidy) +
				tools.roundUp(stmt.basicDailyFee) +
				tools.roundUp(stmt.incomeTestedFee) +
				tools.roundUp(stmt.govContributionAdjustAmount) +
				tools.roundUp(stmt.clientContributionAdjustAmount);

			stmt.totalExpenditure =
				tools.roundUp(stmt.careServices) +
				tools.roundUp(stmt.thirdPartyServices) +
				tools.roundUp(stmt.administrativeFee) +
				tools.roundUp(stmt.coreAdvisoryFee) +
				tools.roundUp(stmt.advisoryFeeAdjust + stmt.adminFeeAdjust + stmt.clientExpenditureAdjustAmount);

			stmt.closeBalance =
				stmt.openBalance +
				stmt.govTransferAdjust +
				stmt.clientTransferAdjust +
				stmt.totalFunding -
				stmt.totalExpenditure;

			// Get Received Amounts
			stmt.receivedTotalFunding = 0.0;
			rows = await inboundTransaction.getReceivedAmounts(req.user, clientId, year, month);
			rows.forEach((item) => {
				if (item.inboundTypeId === 1) stmt.receivedGovernmentSubsidy = item.receivedAmount;
				if (item.inboundTypeId === 2) stmt.receivedIncomeTestedFee = item.receivedAmount;
				if (item.inboundTypeId === 3) stmt.receivedSuppSubsidy = item.receivedAmount;
				stmt.receivedTotalFunding += item.receivedAmount;
			});

			stmt.exitFee = 0.0;

			console.log(stmt);

			// Insert the new record
			const result = await clientMonthlyStatement.insert(req.user, stmt);
			//console.log(result);
			//if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			// insert() now removes previous record if present
			if (result.rowsAffected.length === 2 && result.rowsAffected[1] === 1) {
				req.body.clientMonthylStatement = stmt;
				const pdfResult = await createPdf(req, res, next);

				return {
					success : 'true',
					message : 'Client Monthly Statement record inserted successfully',
					//id      : result.recordset[0].id,
				};
			}
		}
	} catch (err) {
		console.error(err.stack);
		//next(err);
	}
}
module.exports.createForClient = createForClient;

async function createMonthlyStatements(req, res, next) {
	console.log('controllers:clientMonthlyStatement.createMonthlyStatements(req, res, next)');

	const year = req.body.year;
	const month = req.body.month;
	let clientIds = req.body.clientIds;
	if (clientIds === undefined) {
		// Obtain a list of all the HCP clients for the particular month
	}

	for (clientId of clientIds) {
		req.body.clientId = clientId;
		const result = await createForClient(req, res, next);
	}

	res.status(201).send({
		success : 'true',
		message : 'Client Monthly Statement records inserted successfully',
		//id      : result.recordset[0].id,
	});
}
module.exports.createMonthlyStatements = createMonthlyStatements;

async function remove(req, res, next) {
	console.log('controllers:clientMonthlyStatement.remove(req, res, next)');
	try {
		const id = parseInt(req.params.id);

		const result = await clientMonthlyStatement.remove(req.user, id);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(200).send({
				success : 'true',
				message : 'Client Monthly Statement record deleted successfully',
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

async function removeBlock(req, res, next) {
	console.log('controllers:clientMonthlyStatement.removeBlock(req, res, next)');
	console.log(req.body);
	try {
		const result = await clientMonthlyStatement.removeBlock(
			req.user,
			req.body.year,
			req.body.month,
			req.body.clientId
		);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] >= 1) {
			return res.status(200).send({
				success : 'true',
				message : 'Client Monthly Statement Data records deleted successfully',
				//id      : result.recordset[0].id,
			});
		} else {
			res.status(404).end('200');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.removeBlock = removeBlock;

async function createPdf(req, res, next) {
	console.log('controllers:clientMonthlyStatement.createPdf(req, res, next)');
	//console.log(req.body);

	const stmt = req.body.clientMonthylStatement;
	try {
		const period = stmt.month + '/' + stmt.year;
		const month = stmt.month < 10 ? '0' + stmt.month : stmt.month;
		const year = stmt.year;
		const clientData = await client.getClient(req.user, stmt.clientId);
		console.log(clientData);

		//let suffix = para.filename;
		const suffix = 'Statement';
		//let rootPath = para.rootPath;
		let rootPath = 'C:/Sequel/Documents/HCP/MonthlyStatements/';
		// let rootPath = "//10.1.1.4/Data/accounts/HCP/03 Monthly Statements/HCPTest/"
		const subFolder = stmt.year + '/' + clientData[0].firstName + ' ' + clientData[0].lastName + '/';
		const fileName =
			year +
			'-' +
			month +
			' ' +
			clientData[0].firstName +
			' ' +
			clientData[0].lastName.substring(0, 1) +
			' ' +
			suffix +
			'.pdf';
		let filePath = rootPath + subFolder + fileName;
		//console.log(filePath);
		const context = {};

		context.clientId = stmt.clientId;
		context.startDate = tools.firstDayOfMonth(month, year);
		context.endDate = tools.lastDayOfMonth(month, year);
		context.month = month;
		context.year = year;

		//console.log(context);

		const serviceDetails = await statement.getCarerData(req.user, context);
		//console.log(serviceDetails);

		const thirdPartyServiceDetails = await statement.getThirdPartyServices(context);
		//console.log(thirdPartyServiceDetails);

		const leaveSumaryData = await statement.getLeaveSummaryData(context);
		//console.log(leaveSumaryData);

		const leaveDetails = await statement.getLeaveDetailsData(context);
		//console.log(leaveDetails);

		const incomeTestedFeeSumaryData = await statement.getMonthlyIncomeTestedFee(context);
		//console.log(incomeTestedFeeSumaryData);

		//context.srv = 'initial-balance';
		//const _initialBalance = srvdetail.getSrvDetail(context);
		const initialBalance = await clientInitialBalance.list(req.user, context);
		//console.log(initialBalance);

		context.type = 'supp';
		const suppDetails = await statement.getStatementData(req.user, context);
		//console.log(suppDetails);

		context.type = 'adjustment';
		const adjustmentDetails = await statement.getStatementData(req.user, context);
		//console.log(adjustmentDetails);

		context.type = 'hcp-level';
		const packageLevel = await statement.getStatementData(req.user, context);
		//console.log(packageLevel);

		context.type = 'mgmt-level';
		const managementLevel = await statement.getStatementData(req.user, context);
		//console.log(managementLevel);

		const previousStatementData = await statement.getOpeningBalanceStatement(context);
		//console.log(previousStatementData);

		const leaveSumaryThisPeriod = await statement.getLeaveSummaryPeriod(context);
		//console.log(leaveSumaryThisPeriod);

		if (clientData[0].serviceStartDate >= context.startDate && clientData[0].serviceStartDate <= context.endDate) {
			leaveSumaryPreviousPeriod = null;
		} else {
			context.endDate = tools.dateBefore_DBFormat(context.startDate);
			context.startDate = tools.dateToString(clientData[0].serviceStartDate);
			leaveSumaryPreviousPeriod = await statement.getLeaveSummaryPeriod(context);
		}

		let data = {
			FullName                       : clientData[0].firstName + ' ' + clientData[0].lastName,
			AddressLine1                   : clientData[0].address,
			AddressLine2                   :
				clientData[0].locality + ' ' + clientData[0].state + ' ' + clientData[0].postcode,
			AccountNumber                  :
				clientData[0].lastName + ' ' + clientData[0].firstName.substring(0, 1) + ' HCP',
			PackageLevel                   : packageLevel,
			ManagementLevel                : managementLevel,
			Period                         : period,
			OpenBalance                    : stmt.openBalance.toFixed(2),
			BasicDailyFee                  : stmt.basicDailyFee.toFixed(2),
			IncomeTestedFee                : stmt.incomeTestedFee.toFixed(2),
			GovernmentSubsidy              : stmt.governmentSubsidy.toFixed(2),
			SuppSubsidy                    : stmt.suppSubsidy.toFixed(2),
			TotalFunding                   : stmt.totalFunding.toFixed(2),
			CareServices                   : stmt.careServices.toFixed(2),
			ThirdPartyServices             : stmt.thirdPartyServices.toFixed(2),
			AdministrativeFee              : stmt.administrativeFee.toFixed(2),
			CoreAdvisoryFee                : stmt.coreAdvisoryFee.toFixed(2),
			TotalExpenditure               : stmt.totalExpenditure.toFixed(2),
			CloseBalance                   : stmt.closeBalance.toFixed(2),
			StartDate                      : tools.firstDayOfMonth(month, year),
			EndDate                        : tools.lastDayOfMonth(month, year),
			ServiceStartDate               :
				clientData[0].serviceStartDate != null ? tools.dateToString(clientData[0].serviceStartDate) : '',
			ServiceFinishDate              :
				clientData[0].serviceFinishDate != null ? tools.dateToString(clientData[0].serviceFinishDate) : '',
			ReceivedClientContribution     : stmt.receivedIncomeTestedFee.toFixed(2),
			ReceivedGovernmentSubsidy      : stmt.receivedGovernmentSubsidy.toFixed(2),
			ReceivedSuppSubsidy            : stmt.receivedSuppSubsidy.toFixed(2),
			ClientContributionAdjustAmount : stmt.clientContributionAdjustAmount.toFixed(2),
			GovContributionAdjustAmount    : stmt.govContributionAdjustAmount.toFixed(2),
			OutboundAdjustAmount           : (stmt.clientExpenditureAdjustAmount +
				stmt.adminFeeAdjust +
				stmt.advisoryFeeAdjust).toFixed(2),
			TransferAdjustAmount           : (stmt.clientTransferAdjust + stmt.govTransferAdjust).toFixed(2),
			ClientExpenditureAdjustAmount  : stmt.clientExpenditureAdjustAmount.toFixed(2),
			AdminFeeAdjust                 : stmt.adminFeeAdjust.toFixed(2),
			AdvisoryFeeAdjust              : stmt.advisoryFeeAdjust.toFixed(2),
			ClientTransferAdjust           : stmt.clientTransferAdjust.toFixed(2),
			GovTransferAdjust              : stmt.govTransferAdjust.toFixed(2),
			ServiceDetails                 : serviceDetails,
			ThirdPartyServiceDetails       : thirdPartyServiceDetails,
			LeaveSumaryData                : leaveSumaryData,
			LeaveSumaryThisPeriod          : leaveSumaryThisPeriod,
			LeaveSumaryPreviousPeriod      : leaveSumaryPreviousPeriod,
			LeaveDetails                   : leaveDetails,
			PreviousStatementData          : previousStatementData[0],
			TotalReceivedFunding           : stmt.receivedTotalFunding.toFixed(2),
			InitialBalance                 : initialBalance,
			SuppDetails                    : suppDetails,
			AdjustmentDetails              : adjustmentDetails,
			IncomeTestedFeeSumaryData      : incomeTestedFeeSumaryData,
		};
		//console.log(data);

		//console.log('createPdf: ' + filePath);

		ensureDirectoryExistence(filePath);
		pdf.create(pdfTemplate.summayStatement(data), {}).toFile(filePath, (err) => {
			if (err) {
				res.send('Failed to create pdf file: ' + fileName);
				console.log('error 1');
				next(err);
			} else {
				console.log('The file has been created: ' + fileName);
				//res.status(200);
				//res.end();
				// res.send('The pdf file has been created: ' + fileName);
				res.sendFile(filePath, function(err, data) {
					if (err) {
						if (err.code === 'ENOENT') {
							res.status(404);
							res.send('File not found!');
						} else {
							throw err;
						}
					} else {
						console.log('Sent:', fileName);
						res.status(200).end();
					}
				});
			}
		});
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.createPdf = createPdf;

function ensureDirectoryExistence(filePath) {
	console.log(filePath);
	var dirname = path.dirname(filePath);
	if (fs.existsSync(dirname)) {
		return true;
	}
	ensureDirectoryExistence(dirname);
	fs.mkdirSync(dirname);
}
