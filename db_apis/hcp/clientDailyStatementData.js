const database = require('../../services/database.js');
const { mapDataForSelect, mapDataForInsert, mapDataForUpdate } = require('../../utils/mapUtils');
const { dbModel } = require('../../db_model/hcp/clientDailyStatementData.js');

async function list(user, queryParams) {
	console.log('DB:clientDailyStatementData.list(user)');
	let query = ``;
	const fieldList = mapDataForSelect('A', dbModel, dbModel.primaryKey, user.companyTimezone);

	query = `SELECT 
                ${fieldList},
                B.[First Name] + ' ' + B.[Last Name] AS clientName
            FROM ${dbModel.tableName} A
            JOIN Clients B ON B.[ID] = A.[ClientID] `;

	let where = `WHERE B.[CompanyID] = ${user.companyId} `;

	console.log(queryParams);
	if (queryParams.year && queryParams.month) {
		where += `AND YEAR(A.[Date]) = ${queryParams.year} AND MONTH(A.[Date]) = ${queryParams.month} `;
	}
	if (queryParams.clientId) {
		where += `AND A.ClientID = ${queryParams.clientId} `;
	}

	query += where;

	query += `ORDER BY A.[Date], B.[Last Name], B.[First Name], B.[ID]`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.list = list;

async function get(user, id) {
	console.log('DB:clientDailyStatementData.get(user, id)');
	console.log(`id: ${id}`);

	let query = ``;
	if (id !== undefined) {
		const fieldList = mapDataForSelect('A', dbModel, dbModel.primaryKey, user.companyTimezone);

		query = `SELECT ${fieldList} 
                FROM ${dbModel.tableName} A
                JOIN Clients B ON B.[ID] = A.[ClientID] 
                WHERE A.${dbModel.primaryKey} = ${id}
                  AND B.[CompanyID] = ${user.companyId}`;
	}

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.get = get;

async function update(user, id, data) {
	console.log('DB:clientDailyStatementData.update(user, id, data)');

	let keyValueList = mapDataForUpdate(data, dbModel, dbModel.primaryKey, user.companyTimezone);

	/*const stmt = `UPDATE ${dbModel.tableName} SET ${keyValueList}
                    WHERE ${dbModel.dataFields.companyId} = ${user.companyId}
                    AND ${dbModel.primaryKey} = ${id}`; */
	const stmt = `UPDATE ${dbModel.tableName} SET ${keyValueList}
                    WHERE ${dbModel.primaryKey} = ${id}`;

	console.log(stmt);
	const result = await database.simpleExecute(stmt);
	//console.log(result);
	return result;
}
module.exports.update = update;

async function insert(user, data) {
	console.log('DB:clientDailyStatementData.insert(user, data)');
	let [ fieldList, valueList ] = mapDataForInsert(data, dbModel, dbModel.primaryKey, user.companyTimezone);
	//console.log(fieldList)
	//const stmt = `INSERT INTO ${dbModel.tableName} ([CompanyID],${fieldList}) OUTPUT INSERTED.${dbModel.primaryKey} AS id VALUES (${user.companyId},${valueList});`;
	//const stmt = `INSERT INTO ${dbModel.tableName} (${fieldList}) OUTPUT INSERTED.${dbModel.primaryKey} AS id VALUES (${valueList});`;
	const stmt = `INSERT INTO ${dbModel.tableName} (${fieldList}) VALUES (${valueList});`;

	console.log(stmt);
	result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}
module.exports.insert = insert;

async function remove(user, id) {
	console.log('DB:clientDailyStatementData.remove(user, id)');

	const stmt = `DELETE A 
                    FROM ${dbModel.tableName} A 
                    JOIN CLIENTS B ON B.[ID] = A.[ClientID] 
                    OUTPUT DELETED.${dbModel.primaryKey} AS id 
                    WHERE ${dbModel.primaryKey} = ${id} 
                    AND B.[CompanyID] = ${user.companyId}`;
	//const stmt = `DELETE FROM ${dbModel.tableName} OUTPUT DELETED.${dbModel.primaryKey} AS id
	//                WHERE ${dbModel.primaryKey} = ${id}`;

	console.log(stmt);
	const result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}
module.exports.remove = remove;

async function removeBlock(user, year, month, clientId) {
	console.log('DB:clientDailyStatementData.removeBlock(user, year, month, clientId)');

	let stmt = `DELETE A 
                    FROM ${dbModel.tableName} A 
                    JOIN CLIENTS B ON B.[ID] = A.[ClientID] 
                    WHERE B.[CompanyID] = ${user.companyId}
                      AND YEAR(A.[Date]) = ${year}
                      AND MONTH(A.[Date]) = ${month}`;

	if (clientId !== undefined) {
		stmt += ` AND A.[ClientID] = ${clientId}`;
	}

	console.log(stmt);
	const result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}
module.exports.removeBlock = removeBlock;

// Compile a monthly summary for the ClientMonthlyStatement table.
async function summary(user, clientId, year, month) {
	console.log('DB:clientDailyStatementData.summary(user, clientId, year, month)');

	const query = `SELECT
                ${month} AS month,
                ${year} AS year,
                ${clientId} AS clientId,
                SUM(A.[BasicDailyFee]) AS basicDailyFee,
                SUM(A.[IncomeTestedFee]) AS incomeTestedFee,
                SUM(A.[HCPAmount]) AS governmentSubsidy,
                SUM(A.[SuppAmount]) AS suppSubsidy,
                SUM(A.[CarerServiceCost]) AS careServices,
                SUM(A.[ThirdPartyServiceCost]) AS thirdPartyServices,
                SUM(A.[AdminRate] * (A.[HCPAmount] + A.[BasicDailyFee] + A.[IncomeTestedFee])) AS administrativeFee,
                SUM(A.[MgmtRate]  * (A.[HCPAmount] + A.[BasicDailyFee] + A.[IncomeTestedFee])) AS coreAdvisoryFee,
                SUM(A.[ClientContributionAdjustAmount]) AS clientContributionAdjustAmount,
                SUM(A.[GovContributionAdjustAmount]) AS govContributionAdjustAmount,
                SUM(A.[ClientExpenditureAdjustAmount]) AS clientExpenditureAdjustAmount,
                SUM(A.[AdvisoryFeeAdjust]) AS advisoryFeeAdjust,
                SUM(A.[AdminFeeAdjust]) AS adminFeeAdjust,
                SUM(A.[ClientTransferAdjust]) AS clientTransferAdjust,
                SUM(A.[GovTransferAdjust]) AS govTransferAdjust
            FROM ${dbModel.tableName} A
            JOIN Clients B ON B.[ID] = A.[ClientID]
            WHERE B.[CompanyID] = ${user.companyId}
              AND YEAR(A.[Date]) = ${year}
              AND MONTH(A.[Date]) = ${month}
              AND A.ClientID = ${clientId}`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.summary = summary;

async function insertBlock(user, data) {
	console.log('DB:clientDailyStatementData.insertBlock(user, data)');

	//  Start transaction
	let stmt = database.startTransaction;

	data.forEach((item) => {
		stmt += `DELETE A FROM ${dbModel.tableName} A 
				 JOIN CLIENTS B ON B.[ID] = A.[ClientID] 
				 WHERE B.[CompanyID] = ${user.companyId}
				   AND A.[ClientID] = ${item.clientId}
				   AND A.[Date] = '${item.date}';\n`;

		const [ fieldList, valueList ] = mapDataForInsert(item, dbModel, dbModel.primaryKey, user.companyTimezone);
		stmt += `INSERT INTO ${dbModel.tableName} (${fieldList},[timestamp]) VALUES (${valueList},GETDATE());\n`;
	});

	// Commit the transaction
	stmt += database.endTransaction;
	//console.log(stmt);
	const result = await database.simpleExecute(stmt);
	return result;
}
module.exports.insertBlock = insertBlock;
