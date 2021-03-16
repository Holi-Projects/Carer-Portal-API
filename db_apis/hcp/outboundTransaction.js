const database = require('../../services/database.js');
const { mapDataForSelect, mapDataForInsert, mapDataForUpdate } = require('../../utils/mapUtils');
const { dbModel } = require('../../db_model/hcp/outboundTransaction.js');

async function list(user, queryParams) {
	console.log('DB:outboundTransaction.list(user, queryParams)');
	let query = ``;
	let fieldList = mapDataForSelect('A', dbModel, dbModel.primaryKey, user.companyTimezone);

	query = `SELECT 
                ${fieldList},
                B.[First Name] + ' ' + B.[Last Name] AS clientName
            FROM ${dbModel.tableName} A
            JOIN [Clients] B ON B.[ID] = A.[ClientID] `;

	let where = `WHERE B.[CompanyID] = ${user.companyId} `;

	console.log(queryParams);
	if (queryParams.year && queryParams.month) {
		where += `AND A.[Year] = ${queryParams.year} AND A.[Month] = ${queryParams.month} `;
	}
	if (queryParams.clientId) {
		where += `AND A.[ClientID] =  ${queryParams.clientId} `;
	}

	query += where;

	query += `ORDER BY [timestamp] DESC`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.list = list;

async function get(user, id) {
	console.log('DB:outboundTransaction.get(user, id)');
	console.log(`id: ${id}`);

	let query = ``;
	if (id !== undefined) {
		let fieldList = mapDataForSelect('A', dbModel, dbModel.primaryKey, user.companyTimezone);

		query = `SELECT ${fieldList} FROM ${dbModel.tableName} A
                    WHERE A.${dbModel.primaryKey} = ${id}`;
	}

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.get = get;

async function update(user, id, data) {
	console.log('DB:outboundTransaction.update(user, id, data)');

	let keyValueList = mapDataForUpdate(data, dbModel, dbModel.primaryKey, user.companyTimezone);

	const stmt = `UPDATE ${dbModel.tableName} SET ${keyValueList}
                    WHERE ${dbModel.primaryKey} = ${id}`;

	console.log(stmt);
	const result = await database.simpleExecute(stmt);
	//console.log(result);
	return result;
}
module.exports.update = update;

async function insert(user, data) {
	console.log('DB:outboundTransaction.insert(user, data)');
	let [ fieldList, valueList ] = mapDataForInsert(data, dbModel, dbModel.primaryKey, user.companyTimezone);
	//console.log(fieldList)
	const stmt = `INSERT INTO ${dbModel.tableName} (${fieldList}) OUTPUT INSERTED.${dbModel.primaryKey} AS id VALUES (${valueList});`;

	console.log(stmt);
	result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}
module.exports.insert = insert;

async function remove(user, id) {
	console.log('DB:outboundTransaction.remove(user, id)');

	const stmt = `DELETE FROM ${dbModel.tableName} OUTPUT DELETED.${dbModel.primaryKey} AS id 
                    WHERE ${dbModel.primaryKey} = ${id}`;

	console.log(stmt);
	const result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}
module.exports.remove = remove;

async function insertBlock(user, clientId, year, month) {
	console.log('DB:outboundTransaction.insertBlock(user, clientId, year, month)');

	//  Start transaction
	let stmt = database.startTransaction;

	stmt += `DECLARE @serviceFee DECIMAL(18,2) = 0.00
			 DECLARE @adminFee DECIMAL(18,2) = 0.00
			 DECLARE @advisoryFee DECIMAL(18,2) = 0.00

			 SET @serviceFee = (SELECT ROUND(sum(CarerServiceCost),2) + ROUND(sum(ThirdPartyServiceCost),2)
				FROM [dbo].[ClientDailyStatementData]
				WHERE [ClientID] = ${clientId}
				AND MONTH([Date]) = ${month}
				AND YEAR([Date]) = ${year})
 
			 SET @adminFee = (SELECT SUM(adminFee) FROM (
				SELECT  AdminRate*(ROUND(sum(HCPAmount),2) + ROUND(sum(BasicDailyFee),2) + ROUND(sum(IncomeTestedFee),2)) AS adminFee
				FROM [dbo].[ClientDailyStatementData] 
				WHERE [ClientID] = ${clientId}
				AND MONTH([Date]) = ${month}
				AND YEAR([Date]) = ${year}
				GROUP BY HCPAmount, BasicDailyFee, IncomeTestedFee, AdminRate) AS a)
 
			 SET @advisoryFee = (SELECT SUM(advisoryFee) FROM (
				SELECT MgmtRate*(ROUND(sum(HCPAmount),2) + ROUND(sum(BasicDailyFee),2) + ROUND(sum(IncomeTestedFee),2)) AS advisoryFee
				FROM [dbo].[ClientDailyStatementData] 
				WHERE [ClientID] = ${clientId}
				AND MONTH([Date]) = ${month}
				AND YEAR([Date]) = ${year}
				GROUP BY HCPAmount, BasicDailyFee, IncomeTestedFee, MgmtRate) AS a);\n`;

	stmt += `DELETE FROM [OutboundTransaction] 
				WHERE [ClientID] = ${clientId}
				AND [Month] = ${month}
				AND [Year] = ${year};\n`;

	stmt += `INSERT INTO [OutboundTransaction] ([OutboundID], [ClientID], [Month], [Year], [Amount], [timestamp])
				VALUES (1, ${clientId}, ${month}, ${year}, @serviceFee, GETDATE());\n`;
	stmt += `INSERT INTO [OutboundTransaction] ([OutboundID], [ClientID], [Month], [Year], [Amount], [timestamp])
				VALUES (2, ${clientId}, ${month}, ${year}, @adminFee, GETDATE());\n`;
	stmt += `INSERT INTO [OutboundTransaction] ([OutboundID], [ClientID], [Month], [Year], [Amount], [timestamp])
				VALUES (3, ${clientId}, ${month}, ${year}, @advisoryFee, GETDATE());\n`;

	// Commit the transaction
	stmt += database.endTransaction;
	console.log(stmt);
	result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}
module.exports.insertBlock = insertBlock;
