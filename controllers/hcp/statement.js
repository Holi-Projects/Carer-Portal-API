const tools = require('../../utils/tools.js');
const statement = require('../../db_apis/hcp/statement.js');
const status = require('../../db_apis/hcp/status.js');
const client = require('../../db_apis/client.js');
const clientHcp = require('../../db_apis/hcp/clientHcp.js');
const clientLeaveBooking = require('../../db_apis/hcp/clientLeaveBooking.js');
const clientManagementLevel = require('../../db_apis/hcp/clientManagementLevel.js');
const clientSupplement = require('../../db_apis/hcp/clientSupplement.js');
const clientContribution = require('../../db_apis/hcp/clientContribution.js');
const supplierService = require('../../db_apis/hcp/supplierService.js');
const clientAdminFee = require('../../db_apis/hcp/clientAdminFee.js');
//const bookingChargesDetail = require('../../db_api/hcp/bookingChargesDetail.js');
const clientAdjustmentBalance = require('../../db_apis/hcp/clientAdjustmentBalance.js');
const clientDailyStatementData = require('../../db_apis/hcp/clientDailyStatementData.js');
const inboundTransaction = require('../../db_apis/hcp/inboundTransaction.js');
const outboundTransaction = require('../../db_apis/hcp/outboundTransaction.js');

async function updateStatementData(req, res, next) {
	console.log('Control:updateStatementData(req, res, next)');

	console.log(req.body);

	try {
		//const context = {};

		//context.type = req.params.type;
		//context.clientIds = req.body.clientIds;
		//context.startDate = req.body.startDate;
		//context.endDate = req.body.endDate;
		//let dateStr = new Date(req.body.startDate);
		//let month = dateStr.getMonth() + 1;
		//let year = dateStr.getFullYear();
		//console.log(context);
		let month = req.body.month;
		let year = req.body.year;
		let startDate = new Date(year, month - 1, 1);
		req.body.startDate = `${startDate.getFullYear()}-${(startDate.getMonth() + 1)
			.toString()
			.padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`;
		console.log(req.body.startDate);
		//console.log(startDate.getFullYear());
		//console.log(startDate.getMonth() + 1);
		//console.log(startDate.getDate());
		let endDate = new Date(year, month, 0);
		req.body.endDate = `${endDate.getFullYear()}-${(endDate.getMonth() + 1)
			.toString()
			.padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}`;
		console.log(req.body.endDate);

		let rows = [];

		const clients = await statement.getStatementData(req.user, { ...req.body, type: 'client' });
		console.log(clients.length);
		const hcpData = await statement.getStatementData(req.user, { ...req.body, type: 'hcp' });
		const leaveBookingData = await statement.getStatementData(req.user, {
			...req.body,
			type : 'leave-exceed-quota',
		});
		const mgmtData = await statement.getStatementData(req.user, { ...req.body, type: 'mgmt' });
		const suppData = await statement.getStatementData(req.user, { ...req.body, type: 'supp' });
		const contributionData = await statement.getStatementData(req.user, { ...req.body, type: 'contribution' });
		const thirdPartyService = await statement.getStatementData(req.user, {
			...req.body,
			type : 'third-party-services',
		});
		const adminRateData = await statement.getStatementData(req.user, { ...req.body, type: 'admin' });
		const adjustmentData = await statement.getStatementData(req.user, { ...req.body, type: 'adjustment' });
		const carerServiceData = await statement.getCarerData(req.user, req.body);

		//console.log(clients);
		//console.log(hcpData);
		//console.log(leaveBookingData);
		//console.log(mgmtData);
		//console.log(suppData);
		//console.log(contributionData);
		//console.log(thirdPartyService);
		//console.log(adminRateData);
		//console.log(adjustmentData);
		//console.log(carerServiceData);

		var dailyClientData = [];
		for (let item of clients) {
			let ClientID = item.ClientID;
			let clientLeaveBookingData = leaveBookingData.filter((leave) => leave.ClientID == ClientID);
			let clientHCPData = hcpData.filter((item) => item.ClientID == ClientID);
			let clientMgmtData = mgmtData.filter((item) => item.ClientID == ClientID);
			let clientSuppData = suppData.filter((item) => item.ClientID == ClientID);
			let clientBasicDailyFeeData = contributionData.filter(
				(item) => item.ClientID == ClientID && item.ContributionTypeID[0] == 1
			);
			let clientIncomeTestedFeeData = contributionData.filter(
				(item) => item.ClientID == ClientID && item.ContributionTypeID[0] == 2
			);
			let clientThirdPartyServiceData = thirdPartyService.filter((item) => item.ClientID[0] == ClientID);
			let clientAdminRateData = adminRateData.filter((item) => item.ClientID == ClientID);
			let clientCarerServiceData = carerServiceData.filter((item) => item['Client ID'] == ClientID);

			//var start = new Date(req.body.startDate);
			//var end = new Date(req.body.endDate);
			var start = startDate;
			var end = endDate;
			// Check activate date and finish date of service to adjust actual date range for calculation
			let clientData = await status.getStatus(req.user, ClientID);
			//console.log(clientData);
			let serviceStartMonth =
				clientData[0].ServiceStartDate != null ? clientData[0].ServiceStartDate.getMonth() + 1 : null;
			let serviceEndMonth =
				clientData[0].ServiceFinishDate != null ? clientData[0].ServiceFinishDate.getMonth() + 1 : null;
			let serviceFinishDate =
				clientData[0].ServiceFinishDate != null ? tools.formatDate(clientData[0].ServiceFinishDate) : null;
			let serviceStartDate =
				clientData[0].ServiceStartDate != null ? tools.formatDate(clientData[0].ServiceStartDate) : null;

			/*if (serviceFinishDate != null && serviceEndMonth == month) {
				end = new Date(serviceFinishDate);
			}

			if (serviceStartMonth == month && tools.dateDiff(req.params.startDate, serviceStartDate) > 1) {
				start = new Date(serviceStartDate);
			}*/

			/**console.log(serviceStartMonth);
			console.log(serviceEndMonth);
			console.log(serviceStartDate);
			console.log(serviceFinishDate);
			console.log(start);
			console.log(end);**/

			// Loop through each date in the range to calculate and get data for each date
			var eachDate = new Date(start);

			while (eachDate <= end || tools.inSameDate(eachDate, end)) {
				let rate = 1;

				clientLeaveBookingData.some((item) => {
					let exceedStartDate = item.ExceedTempStartDate;
					let exceedEndDate = item.ExceedTempEndDate;
					if (tools.inRange(eachDate, exceedStartDate, exceedEndDate)) {
						rate = 0.25;
						return true;
					}
				});
				//console.log(eachDate, ' rate: ' + rate);

				// Find daily MGMT Rate (To calculate Core Advisory & Care coordination fee )
				let mgmtRate = 0;
				clientMgmtData.forEach((item) => {
					let startDate = item.StartDate;
					let endDate = item.EndDate;
					if (tools.inRange(eachDate, startDate, endDate)) {
						mgmtRate = item.Rate[0];
					}
				});
				//console.log(eachDate, ' mgmtRate: ' + mgmtRate);

				// Find daily Supp Amount (Supplements cost & funding)
				let suppAmount = 0;
				clientSuppData.forEach((item) => {
					let startDate = item.StartDate;
					let endDate = item.EndDate;
					if (tools.inRange(eachDate, startDate, endDate)) {
						suppAmount += item.Rate;
					}
				});

				// Find daily Basic Daily Fee (Type 1)
				let basicDailyFee = 0;
				clientBasicDailyFeeData.forEach((item) => {
					let startDate = item.StartDate;
					let endDate = item.EndDate;
					if (tools.inRange(eachDate, startDate, endDate)) {
						basicDailyFee = item.Amount;
					}
				});

				// Find daily Income Tested Fee (Type 2)
				let incomeTestedFee = 0;
				clientIncomeTestedFeeData.forEach((item) => {
					let startDate = item.StartDate;
					let endDate = item.EndDate;
					if (tools.inRange(eachDate, startDate, endDate)) {
						incomeTestedFee = item.Amount;
					}
				});

				// Find daily HCP funding amount
				let hcpAmount = 0;
				clientHCPData.forEach((item) => {
					let hcpStartDate = item.StartDate;
					let hcpEndDate = item.EndDate;
					if (tools.inRange(eachDate, hcpStartDate, hcpEndDate)) {
						hcpAmount = item.HCPRate - incomeTestedFee - basicDailyFee;
					}
				});

				// Find Administration Rate
				let adminRate = 0;
				clientAdminRateData.forEach((item) => {
					let startDate = item.StartDate;
					let endDate = item.EndDate;
					if (tools.inRange(eachDate, startDate, endDate)) {
						adminRate = item.Rate;
					}
				});

				// Find Third Party Service cost
				let thirdPartyServiceCost = 0;
				clientThirdPartyServiceData.forEach((item) => {
					let invoiceDate = item.InvoiceDate;

					if (tools.dateDiff(eachDate, invoiceDate) == 1) {
						thirdPartyServiceCost += item.TotalAmount;
					}
				});

				// Find Carer Services cost
				let carerServiceCost = 0;

				clientCarerServiceData.forEach((data) => {
					let Units = 0.0;
					let UnitRate = 0.0;
					let Amount = 0;
					let bookingDate = data['Booking Date'];

					if (tools.dateDiff(eachDate, bookingDate) == 1) {
						if (data['Hours Charged'] !== null && data['Hours Charged'] !== 0) {
							Units = data['Hours Charged'];
							//UnitRate = data['Charge Per Hour'];
							UnitRate = data['Charge Rate Qty'];
							Amount = tools.roundUp(UnitRate * Units);
							carerServiceCost += Amount;
						}

						if (data['Shifts Charged'] !== null && data['Shifts Charged'] !== 0) {
							Units = data['Shifts Charged'];
							UnitRate = data['Charge Per Shift'];
							Amount = tools.roundUp(UnitRate * Units);
							carerServiceCost += Amount;
						}

						if (data['KMs Charged'] !== null && data['KMs Charged'] !== 0) {
							Units = data['KMs Charged'];
							UnitRate = data['Charge Per KM'];
							Amount = tools.roundUp(UnitRate * Units);
							carerServiceCost += Amount;
						}
					}
				});
				//console.log('carerServiceCost: ' + carerServiceCost);

				// Find adjustments
				let clientContributionAdjustAmount = 0;
				let govContributionAdjustAmount = 0;
				let clientExpenditureAdjustAmount = 0;
				let adminFeeAdjust = 0;
				let advisoryFeeAdjust = 0;
				let clientTransferAdjust = 0;
				let govTransferAdjust = 0;

				adjustmentData.forEach((item) => {
					let date = item['Date'];
					if (tools.dateDiff(eachDate, date) == 1) {
						// Adjust Government Contribution
						if (item['AdjustmentTypeID'][0] == 1) govContributionAdjustAmount += item['Amount'];

						// Adjust Client Expenditure on Products and Services
						if (item['AdjustmentTypeID'][0] == 2) clientExpenditureAdjustAmount += item['Amount'];

						// Adjust Client Contribution
						if (item['AdjustmentTypeID'][0] == 3) clientContributionAdjustAmount += item['Amount'];

						// Adjust Admin Fee
						if (item['AdjustmentTypeID'][0] == 4) adminFeeAdjust += item['Amount'];

						// Adjust Advisory Fee
						if (item['AdjustmentTypeID'][0] == 5) advisoryFeeAdjust += item['Amount'];

						// Adjust Transfer Adjustment (Client Portion)
						if (item['AdjustmentTypeID'][0] == 6) clientTransferAdjust += item['Amount'];

						// Adjust Transfer Adjustment (Gov Portion)
						if (item['AdjustmentTypeID'][0] == 7) govTransferAdjust += item['Amount'];
					}
				});

				// Export the result to an JSON object
				dailyClientData.push({
					date                           : tools.formatDate(eachDate),
					ratio                          : rate,
					ClientID                       : ClientID,
					HCPAmount                      : hcpAmount,
					MgmtRate                       : mgmtRate,
					suppAmount                     : suppAmount,
					basicDailyFee                  : basicDailyFee,
					incomeTestedFee                : incomeTestedFee,
					thirdPartyServiceCost          : thirdPartyServiceCost,
					adminRate                      : adminRate,
					carerServiceCost               : carerServiceCost,
					clientContributionAdjustAmount : clientContributionAdjustAmount,
					govContributionAdjustAmount    : govContributionAdjustAmount,
					clientExpenditureAdjustAmount  : clientExpenditureAdjustAmount,
					adminFeeAdjust                 : adminFeeAdjust,
					advisoryFeeAdjust              : advisoryFeeAdjust,
					clientTransferAdjust           : clientTransferAdjust,
					govTransferAdjust              : govTransferAdjust,
				});

				var newDate = eachDate.setDate(eachDate.getDate() + 1);
				eachDate = new Date(newDate);
			} // End WHILE LOOP
		} // End FOR LOOP

		rows = dailyClientData;

		// Step 1: Store daily statement data
		try {
			const result = await statement.storeDailyStatementData(rows);
			// console.log(result)
			if (result !== null) {
				//console.log('done');

				// Step 2: Store inbound data to keep track payment transactions
				try {
					const result = await statement.createInboundData(month, year, clients);
					// console.log(req.body)
					if (result !== null) {
						//console.log('done');
					}
				} catch (err) {
					console.log('error' + err);
					// return res.status(500).send()
				} // End of Storing inbound data
			}
		} catch (err) {
			console.error(err.stack);
			// return res.status(500).send()
		}
		// End of Storing daily statement data

		if (rows.length !== 0) {
			res.status(200).json(rows);
		} else {
			//   res.status(404).end('404');
			res.end('404');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.updateStatementData = updateStatementData;

// function checkDateRate(date, leaveStartDate, leaveEndDate,leaveExceedDate){
//   // console.log("Control:checkDateRate(date, leaveStartDate, leaveEndDate,leaveExceedDate)");
//   console.log(date + '--' + leaveStartDate + '--' + leaveEndDate + '--' + leaveExceedDate)
//   let rate = 1;
//      if (tools.compareDate(date,leaveStartDate)&&!tools.compareDate_(date,leaveEndDate)) {
//           if (leaveExceedDate!==null && leaveExceedDate <= leaveEndDate) { /* In Case the leave exceeded date in the time frame*/
//               if (tools.compareDate(date,leaveExceedDate)&&!tools.compareDate_(date,leaveEndDate)){
//                   rate = 0.25;
//               }
//           }
//      } else {
//       rate = 1;
//      }

//   return rate;
// }

async function getStatementData(req, res, next) {
	console.log('Control:getStatementData(req, res, next)');
	try {
		const context = {};

		context.type = req.params.type;
		context.id = req.params.id;
		context.startDate = req.params.startDate;
		context.endDate = req.params.endDate;

		const rows = await statement.getStatementData(context);

		//   if (req.params.id) {
		if (rows.length !== 0) {
			res.status(200).json(rows);
		} else {
			//   res.status(404).end('404');
			res.end('404');
		}
		//   } else {
		//     res.status(200).json(rows);
		//   }
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.getStatementData = getStatementData;

async function getCarerData(req, res, next) {
	console.log('Control:getCarerData(req, res, next)');
	try {
		const context = {};
		context.id = req.params.id;
		context.startDate = req.params.startDate;
		context.endDate = req.params.endDate;

		// console.log(context)
		const result = await statement.getCarerData(context);
		let rows = [];
		result.forEach((data) => {
			let date = `"` + data['Booking Date'].substring(0, 10) + `"`;
			let dateStr = new Date(date);
			let SlipID = data['ID'];
			let DateOfService = dateStr.toDateString();
			let ActivityID = data['Activity ID'];
			let StartTime = data['Start Time'] !== null ? data['Start Time'].substring(11, 16) : '';
			let EndTime = data['End Time'] !== null ? data['End Time'].substring(11, 16) : '';
			let FundingGroup = data['PricingGroupSuffix'];
			let JobRef = data['Agency Job Ref'] !== null ? data['Agency Job Ref'] : data['Client Job Ref'];
			let Units = 0.0;
			let Description = '';
			let UnitRate = 0.0;
			let TotalCharge = 0.0;

			let UoM = '';
			if (data['Hours Charged'] !== null && data['Hours Charged'] !== 0) {
				UoM = 'Hr';
				Units = data['Hours Charged'].toFixed(2);
				Description = data['Task Name'] + ' ' + data['Task Prefix'];
				UnitRate = data['Charge Per Hour'].toFixed(2);
				TotalCharge = tools.roundUp(UnitRate * Units);
				rows.push([
					SlipID,
					DateOfService,
					ActivityID,
					StartTime,
					EndTime,
					Units,
					UoM,
					Description,
					UnitRate,
					TotalCharge,
					FundingGroup,
					JobRef,
				]);
			}

			if (data['Shifts Charged'] !== null && data['Shifts Charged'] !== 0) {
				UoM = 'Shifts';
				Units = data['Shifts Charged'].toFixed(2);
				Description = data['Task Name'] + ' ' + data['Task Prefix'];
				UnitRate = data['Charge Per Shift'].toFixed(2);
				TotalCharge = tools.roundUp(UnitRate * Units);
				rows.push([
					SlipID,
					DateOfService,
					ActivityID,
					StartTime,
					EndTime,
					Units,
					UoM,
					Description,
					UnitRate,
					TotalCharge,
					FundingGroup,
					JobRef,
				]);
			}

			if (data['KMs Charged'] !== null && data['KMs Charged'] !== 0) {
				UoM = 'Km';
				Units = data['KMs Charged'].toFixed(2);
				Description = 'Travel';
				UnitRate = data['Charge Per KM'].toFixed(2);
				TotalCharge = tools.roundUp(UnitRate * Units);
				rows.push([
					SlipID,
					DateOfService,
					ActivityID,
					StartTime,
					EndTime,
					Units,
					UoM,
					Description,
					UnitRate,
					TotalCharge,
					FundingGroup,
					JobRef,
				]);
			}

			// rows.push(row)
		});

		// console.log(rows)
		// console.log(rows.length)
		if (req.params.id) {
			if (rows.length !== 0) {
				res.status(200).json(rows);
			} else {
				/* no data found */
				//   res.status(404).end('404');
				res.end('404');
			}
		} else {
			res.status(200).json(rows);
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.getCarerData = getCarerData;

async function createMonthlyStatement(req, res, next) {
	console.log('Control:createMonthlyStatement(req, res, next)');
	//const context = {};

	//context.month = req.params.month;
	//context.year = req.params.year;
	try {
		result = await statement.createMonthlyStatement(req.user, req.body);
		res.status(201).json(result);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.createMonthlyStatement = createMonthlyStatement;

//async function storeDailyStatementData(req, res, next) {
//	console.log('Control:storeDailyStatementData(req, res, next)');
//	const context = {};
//
//	context.month = req.params.month;
//	context.year = req.params.year;
//	try {
//		result = await statement.storeDailyStatementData(req.user, req.query, req.body);
//		res.status(201).json(result);
//	} catch (err) {
//		console.error(err.stack);
//		next(err);
//	}
//}
//
//module.exports.storeDailyStatementData = storeDailyStatementData;

async function deleteMonthlyStatement(req, res, next) {
	console.log('Control:deleteMonthlyStatement(req, res, next)');
	const context = {};

	context.month = req.params.month;
	context.year = req.params.year;

	try {
		result = await statement.deleteMonthlyStatement(context, req.body);
		res.status(200).json(result);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.deleteMonthlyStatement = deleteMonthlyStatement;

async function deleteDailyStatement(req, res, next) {
	console.log('Control:deleteDailyStatement(req, res, next)');
	const context = {};

	//context.month = req.params.month;
	//context.year = req.params.year;

	try {
		result = await statement.deleteDailyStatement(req.user, req.body);
		res.status(200).json(result);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.deleteDailyStatement = deleteDailyStatement;

async function getMonthlyStatement(req, res, next) {
	console.log('Control:getMonthlyStatement(req, res, next)');
	try {
		/*const context = {};
		context.id = req.params.id;
		context.month = req.params.month;
		context.year = req.params.year;*/

		const rows = await statement.getMonthlyStatement(req.user, req.query);

		if (rows.length !== 0) {
			res.status(200).json(rows);
		} else {
			res.end('404');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.getMonthlyStatement = getMonthlyStatement;

async function retrieveStatementData(req, res, next) {
	console.log('Control:retrieveStatementData(req, res, next)');
	try {
		/*const context = {};
		context.id = req.params.id;
		context.startDate = req.params.startDate;
		context.endDate = req.params.endDate;*/

		const rows = await statement.retrieveStatementData(req.user, req.query);

		if (rows.length !== 0) {
			res.status(200).json(rows);
		} else {
			res.end('404');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.retrieveStatementData = retrieveStatementData;

async function getClient(req, res, next) {
	try {
		const rows = await statement.getClient(req.user, req.query);
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.getClient = getClient;

async function createDailyData(req, res, next) {
	console.log(req.body);

	const user = req.user;
	const clientId = parseInt(req.body.clientId);
	const month = parseInt(req.body.month);
	const year = parseInt(req.body.year);

	try {
		const rows = await client.getClient(user, clientId);

		let startDate = new Date(year, month - 1, 1); // month argument to Date is 0 indexed
		let endDate = new Date(year, month, 0); // using 0 for day results in the last day of the previous month
		const firstDay = startDate.getDate(); // integer values of day to use for loop and avoid DST issues.
		const lastDay = endDate.getDate();

		const dailyData = [];
		for (day = firstDay; day <= lastDay; day++) {
			//console.log(day);
			const dayStr = tools.dateToString(new Date(year, month - 1, day)); // YYYY-MM-DD version used in SQL statements

			const newRecord = {
				clientId : clientId,
				date     : dayStr,
			};

			const ratio = await clientLeaveBooking.ratio(user, clientId, dayStr);
			const hcpRate = await clientHcp.rate(user, clientId, dayStr);
			const basicDailyFee = await clientContribution.amount(user, clientId, dayStr, 1);
			const incomeTestedFee = await clientContribution.amount(user, clientId, dayStr, 2);
			let hcpAmount = hcpRate - basicDailyFee - incomeTestedFee;
			if (ratio != 1) hcpAmount = (hcpAmount + incomeTestedFee) * ratio - incomeTestedFee; // RL logic seems wierd to me

			newRecord.ratio = ratio;
			newRecord.hcpAmount = hcpAmount;
			newRecord.mgmtRate = await clientManagementLevel.rate(user, clientId, dayStr);
			newRecord.suppAmount = await clientSupplement.rate(user, clientId, dayStr);
			newRecord.basicDailyFee = basicDailyFee;
			newRecord.incomeTestedFee = incomeTestedFee;
			newRecord.thirdPartyServiceCost = await supplierService.totalAmount(user, clientId, dayStr);
			newRecord.adminRate = await clientAdminFee.rate(user, clientId, dayStr);
			newRecord.carerServiceCost = await statement.carerServiceCost(user, clientId, dayStr);
			newRecord.clientContributionAdjustAmount = await clientAdjustmentBalance.amount(user, clientId, dayStr, 3);
			newRecord.govContributionAdjustAmount = await clientAdjustmentBalance.amount(user, clientId, dayStr, 1);
			newRecord.clientExpenditureAdjustAmount = await clientAdjustmentBalance.amount(user, clientId, dayStr, 2);
			newRecord.adminFeeAdjust = await clientAdjustmentBalance.amount(user, clientId, dayStr, 4);
			newRecord.advisoryFeeAdjust = await clientAdjustmentBalance.amount(user, clientId, dayStr, 5);
			newRecord.clientTransferAdjust = await clientAdjustmentBalance.amount(user, clientId, dayStr, 6);
			newRecord.govTransferAdjust = await clientAdjustmentBalance.amount(user, clientId, dayStr, 7);

			//console.log(newRecord);
			dailyData.push(newRecord);
		}
		const r2 = await clientDailyStatementData.insertBlock(user, dailyData);
		const r3 = await inboundTransaction.insertBlock(user, clientId, year, month);
		const r4 = await outboundTransaction.insertBlock(user, clientId, year, month);

		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.createDailyData = createDailyData;
