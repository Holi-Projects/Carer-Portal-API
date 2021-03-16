const database = require('../../services/database.js');
const { mapDataForSelect, mapDataForInsert, mapDataForUpdate } = require('../../utils/mapUtils');
const { dbModel } = require('../../db_model/hcp/clientLeaveBooking.js');
const financialYear = require('./financialYear.js');
const clientLeaveQuota = require('./clientLeaveQuota.js');

async function list(user, queryParams) {
	console.log('DB:clientLeaveBooking.list(user)');
	let query = ``;
	const fieldList = mapDataForSelect('A', dbModel, dbModel.primaryKey, user.companyTimezone);

	query = `SELECT 
                ${fieldList}
            FROM ${dbModel.tableName} A
            JOIN Clients B ON B.[ID] = A.[ClientID] `;

	let where = `WHERE B.[CompanyID] = ${user.companyId} `;

	if (queryParams.clientId) {
		console.log(queryParams);
		where += `AND A.ClientID =  ${queryParams.clientId} `;
	}

	query += where;

	query += `ORDER BY A.[StartDate]`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.list = list;

async function get(user, id) {
	console.log('DB:clientLeaveBooking.get(user, id)');
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
	console.log('DB:clientLeaveBooking.update(user, id, data)');

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
	console.log('DB:clientLeaveBooking.insert(user, data)');

	// Determine Financial Year
	const fyQueryParams = { startDate: data.startDate };
	if (data.endDate) fyQueryParams.endDate = data.endDate;
	const fyRows = await financialYear.list(user, fyQueryParams);
	if (fyRows.length !== 1) {
		return { success: false, message: 'Could not find Financial Year' };
	}

	// Determine clientLeaveQuotaId using clientId and leaveTypeId
	const queryParams = { financialYearId: fyRows[0].id, clientId: data.clientId, leaveTypeId: data.leaveTypeId };
	const rows = await clientLeaveQuota.list(user, queryParams);
	if (rows.length !== 1) {
		return { success: false, message: 'Could not find Leave Quota for Client' };
	}
	data.clientLeaveQuotaId = rows[0].id;

	// Determine Leave Taken
	if (data.endDate) {
		const MS_PER_DAY = 24 * 60 * 60 * 1000;
		const d1 = new Date(data.startDate);
		const d2 = new Date(data.endDate);
		data.leaveTaken = Math.floor((d2 - d1) / (1000 * 60 * 60 * 24)) + 1;
	} else {
		data.leaveTaken = 1;
	}
	data.leaveRemaining = rows[0].currentLeaveQuota - data.leaveTaken;

	let [ fieldList, valueList ] = mapDataForInsert(data, dbModel, dbModel.primaryKey, user.companyTimezone);
	const stmt = `INSERT INTO ${dbModel.tableName} (${fieldList}) OUTPUT INSERTED.${dbModel.primaryKey} AS id VALUES (${valueList});`;

	console.log(stmt);
	result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}
module.exports.insert = insert;

async function remove(user, id) {
	console.log('DB:clientLeaveBooking.remove(user, id)');

	const stmt = `DELETE FROM ${dbModel.tableName} OUTPUT DELETED.${dbModel.primaryKey} AS id 
                    WHERE ${dbModel.primaryKey} = ${id}`;

	console.log(stmt);
	const result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}
module.exports.remove = remove;

async function ratio(user, clientId, date) {
	console.log('DB:clientLeaveBooking.ratio(user, clientId, date)');

	let query = `SELECT
				0.25 AS ratio
				FROM ClientLeaveBooking CL
				JOIN Clients C ON C.[ID] = CL.[ClientID] AND C.[CompanyID] = ${user.companyId}
				WHERE CL.[ClientID] = ${clientId}
				AND CL.[ExceedTempStartDate] IS NOT NULL
				AND '${date}' >= CL.[ExceedTempStartDate] 
				AND '${date}' <= DATEADD(DAY, - CL.[LeaveRemaining] - 1, CL.[ExceedTempStartDate])`;

	console.log(query);
	const result = await database.simpleExecute(query);

	if (result.recordset.length > 0) return result.recordset[0].ratio;

	return 1;
}
module.exports.ratio = ratio;
