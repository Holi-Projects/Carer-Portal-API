const database = require('../../services/database.js');
const { mapDataForSelect, mapDataForInsert, mapDataForUpdate } = require('../../utils/mapUtils');
const { dbModel } = require('../../db_model/hcp/clientHcp.js');
const { utcDate2dbDate } = require('../../utils/dateTimeUtil.js');

async function list(user, queryParams) {
	console.log('DB:clientHcp.list(user)');
	let query = ``;
	const fieldList = mapDataForSelect('A', dbModel, dbModel.primaryKey, user.companyTimezone);

	query = `SELECT 
                ${fieldList},
                B.[First Name] + ' ' + B.[Last Name] AS clientName,
                B.[Last Name] + ', ' + B.[First Name] AS clientName2,
                B.[Date of Birth] AS dateOfBirth,
                B.[Address] AS address,
                B.[City] + ' ' + B.[State/Province] + ' ' + B.[Zip/Postal Code] AS locality
            FROM ${dbModel.tableName} A
            JOIN Clients B ON B.[ID] = A.[ClientID] `;

	let where = `WHERE B.[CompanyID] = ${user.companyId} `;

	if (queryParams.activeOnly != undefined) {
		where +=
			'AND A.[StartDate] <= GETDATE() AND (DATEADD(DAY, 1, A.[EndDate]) > GETDATE() OR A.[EndDate] IS NULL) AND B.[Deceased] = 0 ';
	}
	if (queryParams.clientId) {
		where += `AND A.[ClientID] = ${queryParams.clientId} `;
	}

	query += where;

	query += `ORDER BY B.[Last Name], B.[First Name], A.[StartDate]`;

	//console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.list = list;

async function get(user, id) {
	console.log('DB:clientHcp.get(user, id)');
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
	console.log('DB:clientHcp.update(user, id, data)');

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
	console.log('DB:clientHcp.insert(user, data)');

	let stmt = database.startTransaction;

	// End date the current record (if present)
	stmt += `UPDATE ${dbModel.tableName} 
			SET [EndDate] = DATEADD(DAY, -1, ${utcDate2dbDate(`'${data.startDate}'`, user.companyTimezone)}) 
			WHERE [ClientID] = ${data.clientId} 
			AND [EndDate] IS NULL;\n`;
	/*stmt += `UPDATE ${dbModel.tableName} 
			SET [EndDate] = DATEADD(DAY, -1, ${utcDate2dbDate(`'${data.startDate}'`, user.companyTimezone)}) 
			WHERE [AgenciesClientsSeqNo] = ${data.fundingArrangementId} 
			AND [EndDate] IS NULL;\n`;*/

	// Insert new record
	let [ fieldList, valueList ] = mapDataForInsert(data, dbModel, dbModel.primaryKey, user.companyTimezone);
	stmt += `INSERT INTO ${dbModel.tableName} (${fieldList}) OUTPUT INSERTED.${dbModel.primaryKey} AS id VALUES (${valueList});\n`;

	stmt += database.endTransaction;

	console.log(stmt);
	result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}
module.exports.insert = insert;

async function remove(user, id) {
	console.log('DB:clientHcp.remove(user, id)');

	const stmt = `DELETE FROM ${dbModel.tableName} OUTPUT DELETED.${dbModel.primaryKey} AS id 
                    WHERE ${dbModel.primaryKey} = ${id}`;

	console.log(stmt);
	const result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}
module.exports.remove = remove;

async function rate(user, clientId, date) {
	console.log('DB:clientHcp.rate(user, clientId, date)');

	let query = `SELECT
				HR.[HCPRate] AS rate
				FROM HCPRate HR
				JOIN ClientHCP CH ON CH.[HCPLevelCode] = HR.[HCPLevelCode]
				JOIN Clients C ON C.[ID] = CH.[ClientID] AND C.[CompanyID] = ${user.companyId}
				JOIN FinancialYear F ON F.[FinancialYearID] = HR.[FinancialYearID]
				WHERE CH.[ClientID] = ${clientId}
				AND '${date}' >= CH.[StartDate] AND ('${date}' <= CH.[EndDate] OR CH.[EndDate] IS NULL)
				-- AND '${date}' >= HR.[HCPStartDate] AND '${date}' <= HR.[HCPEndDate]
				AND '${date}' >= F.[StartDate] AND '${date}' <= F.[EndDate]`;

	//console.log(query);
	const result = await database.simpleExecute(query);

	if (result.recordset.length > 0) return result.recordset[0].rate;

	return 0;
}
module.exports.rate = rate;
