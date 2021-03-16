const database = require('../../services/database.js');
const { mapDataForSelect, mapDataForInsert, mapDataForUpdate } = require('../../utils/mapUtils');
const { dbModel } = require('../../db_model/hcp/clientAdjustmentBalance.js');

async function list(user, queryParams) {
	console.log('DB:clientAdjustmentBalance.list(user)');
	let query = ``;
	const fieldList = mapDataForSelect('A', dbModel, dbModel.primaryKey, user.companyTimezone);

	query = `SELECT 
                ${fieldList}
            FROM ${dbModel.tableName} A
            JOIN Clients B ON B.[ID] = A.[ClientID]`;

	let where = `WHERE B.[CompanyID] = ${user.companyId} `;

	if (queryParams.clientId) {
		console.log(queryParams);
		where += `AND A.ClientID =  ${queryParams.clientId} `;
	}

	query += where;

	query += `ORDER BY A.[Date] DESC`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.list = list;

async function get(user, id) {
	console.log('DB:clientAdjustmentBalance.get(user, id)');
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
	console.log('DB:clientAdjustmentBalance.update(user, id, data)');

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
	console.log('DB:clientAdjustmentBalance.insert(user, data)');
	let [ fieldList, valueList ] = mapDataForInsert(data, dbModel, dbModel.primaryKey, user.companyTimezone);
	//console.log(fieldList)
	//const stmt = `INSERT INTO ${dbModel.tableName} ([CompanyID],${fieldList}) OUTPUT INSERTED.${dbModel.primaryKey} AS id VALUES (${user.companyId},${valueList});`;
	const stmt = `INSERT INTO ${dbModel.tableName} (${fieldList}) OUTPUT INSERTED.${dbModel.primaryKey} AS id VALUES (${valueList});`;

	console.log(stmt);
	result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}
module.exports.insert = insert;

async function remove(user, id) {
	console.log('DB:clientAdjustmentBalance.remove(user, id)');

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

async function amount(user, clientId, date, adjustmentTypeId) {
	console.log('DB:clientAdjustmentBalance.amount(user, clientId, date, adjustmentTypeId)');

	let query = `SELECT
				CA.[Amount] AS amount
				FROM ClientAdjustmentBalance CA
				JOIN Clients C ON C.[ID] = CA.[ClientID] AND C.[CompanyID] = ${user.companyId}
				WHERE CA.[ClientID] = ${clientId}
				AND CA.[Date] = '${date}'
				AND CA.[AdjustmentTypeID] = ${adjustmentTypeId}`;

	//console.log(query);
	const result = await database.simpleExecute(query);

	if (result.recordset.length > 0) return result.recordset[0].amount;

	return 0;
}
module.exports.amount = amount;
