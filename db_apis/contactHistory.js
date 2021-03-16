const database = require('../services/database.js');
const { mapDataForSelect, mapDataForInsert, mapDataForUpdate } = require('../utils/mapUtils');
const { dbModel } = require('../db_model/contactHistory.js');

// Get high level followup information
async function list(user, queryParams) {
	//console.log('DB:contactHistory.list(user, queryParams)');

	let fieldList = mapDataForSelect('H', dbModel, dbModel.primaryKey, user.companyTimezone);
	let query = `SELECT 
					${fieldList},
					C.[First Name] + N' ' + C.[Last Name] AS clientName,
					A.[Company] AS agencyName,
					R.[First Name] + N' ' + R.[Last Name] AS carerName,
					E.[First Name] + N' ' + E.[Last Name] AS employeeName
				FROM ${dbModel.tableName} H
				LEFT JOIN Clients C ON C.ID = H.[Client ID]
				LEFT JOIN Agencies A ON A.ID = H.[Agency ID]
				LEFT JOIN Carers R ON R.ID = H.[Carer ID]
				LEFT JOIN Employees E ON E.ID = H.[Employee ID] `;

	// Build WHERE clause
	let where = `WHERE H.[CompanyID] = ${user.companyId} `;
	if (queryParams.carerId) {
		where += `AND H.[Carer ID] = ${queryParams.carerId} `;
	}
	if (queryParams.agencyId) {
		where += `AND H.[Agency ID] = ${queryParams.agencyId} `;
	}
	if (queryParams.clientId) {
		where += `AND H.[Client ID] = ${queryParams.clientId} `;
	}
	if (queryParams.employeeId) {
		where += `AND H.[Employee ID] = ${queryParams.employeeId} `;
	}
	//if (!filters.includeComplete) {
	//	query += 'AND H.[Follow Up Complete] = 0 ';
	//}
	query += where;

	query += 'ORDER BY ISNULL(H.[Date Changed], H.[Date Added]) DESC';

	//console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.list = list;

async function get(user, id) {
	//console.log('DB:contactHistory.get(user, id)');

	let query = ``;
	if (id !== undefined) {
		let fieldList = mapDataForSelect('A', dbModel, dbModel.primaryKey, user.companyTimezone);

		query = `SELECT ${fieldList} FROM ${dbModel.tableName} A 
					WHERE ${dbModel.primaryKey} = ${id} AND ${dbModel.dataFields.companyId} = ${user.companyId}`;
	}

	//console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.get = get;

async function getIds(id) {
	//console.log('DB:contactHistory.getIds(user, id)');

	let query = ``;
	if (id !== undefined) {
		query = `SELECT 
					[ID] AS id,
					[CompanyID] AS companyId,
					[Client ID] AS clientId,
					[Agency ID] AS agencyId,
					[Carer ID] AS carerId,
					[Employee ID] AS employeeId
				FROM ${dbModel.tableName} 
				WHERE ${dbModel.primaryKey} = ${id}`;
	}

	//console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getIds = getIds;

async function update(user, id, data) {
	//console.log('DB:contactHistory.update(user, id, data)');
	//console.log(dbModel);

	let keyValueList = mapDataForUpdate(data, dbModel, dbModel.primaryKey, user.companyTimezone);

	const stmt = `UPDATE ${dbModel.tableName} SET ${keyValueList}
					WHERE ${dbModel.primaryKey} = ${id} AND ${dbModel.dataFields.companyId} = ${user.companyId}`;
	//console.log(stmt);

	const result = await database.simpleExecute(stmt);
	//console.log(result);
	return result;
}
module.exports.update = update;

async function insert(user, data) {
	//console.log('DB:contactHistory.insert(user, data)');
	let [ fieldList, valueList ] = mapDataForInsert(data, dbModel, dbModel.primaryKey, user.companyTimezone);
	//console.log(fields)
	const stmt = `INSERT INTO ${dbModel.tableName} ([CompanyID],${fieldList}) OUTPUT INSERTED.${dbModel.primaryKey} AS id VALUES (${user.companyId},${valueList});`;

	//console.log(stmt);
	result = await database.simpleExecute(stmt);
	//console.log(result);
	return result;
}
module.exports.insert = insert;

async function remove(user, id) {
	//console.log('DB:contactHistory.remove(user, id)');

	let stmt = `DELETE FROM ${dbModel.tableName} OUTPUT DELETED.${dbModel.primaryKey} AS id 
					WHERE ${dbModel.primaryKey} = ${id} AND ${dbModel.dataFields.companyId} = ${user.companyId}`;

	//console.log(stmt);
	const result = await database.simpleExecute(stmt);
	//console.log(result);
	return result;
}
module.exports.remove = remove;
