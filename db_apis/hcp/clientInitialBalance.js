const database = require('../../services/database.js');
const { mapDataForSelect, mapDataForInsert, mapDataForUpdate } = require('../../utils/mapUtils');
const { dbModel } = require('../../db_model/hcp/clientInitialBalance.js');

async function list(user, queryParams) {
	console.log('DB:clientInitialBalance.list(user, queryParams)');
	let query = ``;
	let fieldList = mapDataForSelect('A', dbModel, dbModel.primaryKey, user.companyTimezone);

	query = `SELECT 
                ${fieldList}
            FROM ${dbModel.tableName} A
            JOIN [Clients] B ON B.[ID] = A.[ClientID]`;

	let where = `WHERE B.[CompanyID] = ${user.companyId} `;

	if (queryParams.clientId) {
		where += `AND A.[ClientID] =  ${queryParams.clientId} `;
	}

	query += where;

	query += `ORDER BY B.[Last Name], B.[First Name]`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.list = list;

async function get(user, id) {
	console.log('DB:clientInitialBalance.get(user, id)');
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
	console.log('DB:clientInitialBalance.update(user, id, data)');

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
	console.log('DB:clientInitialBalance.insert(user, data)');
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
	console.log('DB:clientInitialBalance.remove(user, id)');

	const stmt = `DELETE FROM ${dbModel.tableName} OUTPUT DELETED.${dbModel.primaryKey} AS id 
                    WHERE ${dbModel.primaryKey} = ${id}`;

	console.log(stmt);
	const result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}
module.exports.remove = remove;

// Compile a monthly summary for the ClientMonthlyStatement table.
async function summary(user, clientId) {
	console.log('DB:clientInitialBalance.summary(user, clientId)');

	const query = `SELECT
                A.[ClientId] AS clientId,
                SUM(A.[Amount]) AS initialBalance
            FROM ${dbModel.tableName} A
            JOIN Clients B ON B.[ID] = A.[ClientID]
            WHERE B.[CompanyID] = ${user.companyId}
			  AND A.[ClientID] = ${clientId}
			GROUP BY A.[ClientID]`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.summary = summary;
