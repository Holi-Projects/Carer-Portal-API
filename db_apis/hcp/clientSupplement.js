const database = require('../../services/database.js');
const { mapDataForSelect, mapDataForInsert, mapDataForUpdate } = require('../../utils/mapUtils');
const { dbModel } = require('../../db_model/hcp/clientSupplement.js');
const { utcDate2dbDate } = require('../../utils/dateTimeUtil.js');

async function list(user, queryParams) {
	console.log('DB:clientSupplement.list(user)');
	let query = ``;
	const fieldList = mapDataForSelect('A', dbModel, dbModel.primaryKey, user.companyTimezone);

	query = `SELECT 
                ${fieldList}
            FROM ${dbModel.tableName} A
            JOIN Clients B ON B.[ID] = A.[ClientID] 
            JOIN Supplement C ON C.[SuppID] = A.[SuppID] `;

	let where = `WHERE B.[CompanyID] = ${user.companyId} `;

	if (queryParams.activeOnly != undefined) {
		where +=
			'AND A.[StartDate] <= GETDATE() AND (DATEADD(DAY, 1, A.[EndDate]) > GETDATE() OR A.[EndDate] IS NULL) ';
	}
	if (queryParams.clientId) {
		where += `AND A.[ClientID] = ${queryParams.clientId} `;
	}

	query += where;

	query += `ORDER BY C.[Name]`;

	//console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.list = list;

async function get(user, id) {
	console.log('DB:clientSupplement.get(user, id)');
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
	console.log('DB:clientSupplement.update(user, id, data)');

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
	console.log('DB:clientSupplement.insert(user, data)');

	let stmt = database.startTransaction;

	// End date the current record (if present)
	stmt += `UPDATE ${dbModel.tableName} 
			SET [EndDate] = DATEADD(DAY, -1, ${utcDate2dbDate(`'${data.startDate}'`, user.companyTimezone)}) 
			WHERE [ClientID] = ${data.clientId} 
			AND [SuppID] = ${data.supplementId} 
			AND [EndDate] IS NULL;\n`;
	/*stmt += `UPDATE ${dbModel.tableName} 
			SET [EndDate] = DATEADD(DAY, -1, ${dbStartDate}) 
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
	console.log('DB:clientSupplement.remove(user, id)');

	/*const stmt = `DELETE FROM ${dbModel.tableName} OUTPUT DELETED.${dbModel.primaryKey} AS id 
                    WHERE ${dbModel.primaryKey} = ${id} 
                    AND ${dbModel.dataFields.companyId} = ${user.companyId}`;*/
	const stmt = `DELETE FROM ${dbModel.tableName} OUTPUT DELETED.${dbModel.primaryKey} AS id 
                    WHERE ${dbModel.primaryKey} = ${id}`;

	console.log(stmt);
	const result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}
module.exports.remove = remove;

async function rate(user, clientId, date) {
	console.log('DB:clientSupplement.rate(user, clientId, date)');

	let query = `SELECT
				SUM(SR.[Rate]) AS rate
				FROM SuppRate SR
				--JOIN Supplement S ON S.[SuppID] = SR.[SuppID]
				JOIN ClientSupplement CS ON CS.[SuppID] = SR.[SuppId]
				JOIN Clients C ON C.[ID] = CS.[ClientID]
				JOIN FinancialYear F ON F.[FinancialYearID] = SR.[FinancialYearID]
				WHERE C.[CompanyID] = ${user.companyId}
				AND CS.[ClientID] = ${clientId}
				AND '${date}' >= CS.[StartDate] AND ('${date}' <= CS.[EndDate] OR CS.[EndDate] IS NULL)
				AND '${date}' >= F.[StartDate] AND '${date}' <= F.[EndDate]`;

	//console.log(query);
	const result = await database.simpleExecute(query);

	if (result.recordset.length > 0 && result.recordset.rate != null) return result.recordset[0].rate;

	return 0;
}
module.exports.rate = rate;
