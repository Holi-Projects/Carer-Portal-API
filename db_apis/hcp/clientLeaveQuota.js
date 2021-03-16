const database = require('../../services/database.js');
const { mapDataForSelect, mapDataForInsert, mapDataForUpdate } = require('../../utils/mapUtils');
const { dbModel } = require('../../db_model/hcp/clientLeaveQuota.js');

async function list(user, queryParams) {
	console.log('DB:clientLeaveQuota.list(user)');
	let query = ``;
	const fieldList = mapDataForSelect('A', dbModel, dbModel.primaryKey, user.companyTimezone);

	query = `SELECT 
                ${fieldList},
                D.[LeaveTypeName] AS leaveType,
                D.[LeaveQuota] AS leaveQuota,
                E.[LeaveCalcModeName] AS leaveCalcMode,
                'Financial Year (' + FORMAT(C.[startDate], 'dd-MM-yyyy') + ' -> ' + FORMAT(C.[endDate], 'dd-MM-yyyy') + ')' AS financialYear
            FROM ${dbModel.tableName} A
            JOIN Clients B ON B.[ID] = A.[ClientID]
            JOIN [FinancialYear] C ON C.[FinancialYearID] = A.[FinancialYearID]
            JOIN [LeaveType] D ON D.[LeaveTypeID] = A.[LeaveTypeID]
            JOIN [LeaveCalcMode] E ON E.[LeaveCalcModeID] = D.[LeaveCalcModeID] `;

	let where = `WHERE B.[CompanyID] = ${user.companyId} `;

	if (queryParams.financialYearId) {
		console.log(queryParams);
		where += `AND A.[FinancialYearID] =  ${queryParams.financialYearId} `;
	}

	if (queryParams.clientId) {
		console.log(queryParams);
		where += `AND A.[ClientID] =  ${queryParams.clientId} `;
	}

	if (queryParams.leaveTypeId) {
		console.log(queryParams);
		where += `AND A.[LeaveTypeID] =  ${queryParams.leaveTypeId} `;
	}

	query += where;

	query += `ORDER BY C.[StartDate]`;

	console.log(query);
	const result = await database.simpleExecute(query);
	console.log(result);
	return result.recordset;
}
module.exports.list = list;

async function get(user, id) {
	console.log('DB:clientLeaveQuota.get(user, id)');
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
	console.log('DB:clientLeaveQuota.update(user, id, data)');

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
	console.log('DB:clientLeaveQuota.insert(user, data)');
	let [ fieldList, valueList ] = mapDataForInsert(data, dbModel, dbModel.primaryKey, user.companyTimezone);
	const stmt = `INSERT INTO ${dbModel.tableName} (${fieldList}) OUTPUT INSERTED.${dbModel.primaryKey} AS id VALUES (${valueList});`;

	console.log(stmt);
	result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}
module.exports.insert = insert;

async function remove(user, id) {
	console.log('DB:clientLeaveQuota.remove(user, id)');

	const stmt = `DELETE FROM ${dbModel.tableName} OUTPUT DELETED.${dbModel.primaryKey} AS id 
                    WHERE ${dbModel.primaryKey} = ${id}`;

	console.log(stmt);
	const result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}
module.exports.remove = remove;
