const database = require('../../services/database.js');
const { mapDataForSelect, mapDataForInsert, mapDataForUpdate } = require('../../utils/mapUtils');
const { dbModel } = require('../../db_model/hcp/clientAdminFee.js');
const { utcDate2dbDate } = require('../../utils/dateTimeUtil.js');

async function list(user, queryParams) {
	console.log('DB:clientAdminFee.list(user)');
	let query = ``;
	const fieldList = mapDataForSelect('A', dbModel, dbModel.primaryKey, user.companyTimezone);

	query = `SELECT 
                ${fieldList}
            FROM ${dbModel.tableName} A
            JOIN Clients B ON B.[ID] = A.[ClientID] 
            JOIN AdministrativeFee C ON C.[AdministrativeFeeID] = A.[AdministrativeFeeID] `;

	let where = `WHERE B.[CompanyID] = ${user.companyId} `;

	if (queryParams.activeOnly != undefined) {
		where +=
			'AND A.[StartDate] <= GETDATE() AND (DATEADD(DAY, 1, A.[EndDate]) > GETDATE() OR A.[EndDate] IS NULL) ';
	}
	if (queryParams.clientId) {
		where += `AND A.[ClientID] = ${queryParams.clientId} `;
	}

	query += where;

	query += `ORDER BY C.[AdministrativeFeeName]`;

	// console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.list = list;

async function get(user, id) {
	console.log('DB:clientAdminFee.get(user, id)');
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
	console.log('DB:clientAdminFee.update(user, id, data)');

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
	console.log('DB:clientAdminFee.insert(user, data)');

	let stmt = database.startTransaction;

	// End date the current record (if present)
	stmt += `UPDATE ${dbModel.tableName} 
			SET [EndDate] = DATEADD(DAY, -1, ${utcDate2dbDate(`'${data.startDate}'`, user.companyTimezone)}) 
			WHERE [ClientID] = ${data.clientId} 
			-- AND [AdministrativeFeeID] = ${data.adminFeeId} 
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
	console.log('DB:clientAdminFee.remove(user, id)');

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
	console.log('DB:clientAdminFee.rate(user, clientId, date)');

	let query = `SELECT
				CA.[Rate] AS rate
				--AF.[AdministativeFeeRate] AS rate
				FROM AdministrativeFee AF
				JOIN ClientAdminFee CA ON CA.[AdministrativeFeeID] = AF.[AdministrativeFeeID]
				JOIN Clients C ON C.[ID] = CA.[ClientID] AND C.[CompanyID] = ${user.companyId}
				WHERE CA.[ClientID] = ${clientId}
				AND '${date}' >= CA.[StartDate] AND ('${date}' <= CA.[EndDate] OR CA.[EndDate] IS NULL)`;

	//console.log(query);
	const result = await database.simpleExecute(query);
	if (result.recordset.length > 0) return result.recordset[0].rate;

	return 0;
}
module.exports.rate = rate;
