const database = require('../services/database.js');
const dateTimeUtil = require('../utils/dateTimeUtil');
/*const mapUtils = require('../utils/mapUtils');

const dbField = {
	id           : '[IncidentDocNo]',
	incidentId   : '[IncidentNo]',
	name         : '[IncidentDocName]',
	injury       : '[Injury]',
	dateUploaded : '[DateUploaded]',
};

const dateFields = [ '[DateUploaded]' ];*/
const { mapDataForSelect, mapDataForInsert, mapDataForUpdate } = require('../utils/mapUtils');
const { dbModel } = require('../db_model/incidentDocument.js');

async function getList(user, queryParams) {
	console.log('DB:incidentDocument.getList(user, queryParams)');

	let query = `SELECT
               ID.[IncidentDocNo] AS id,
               ID.[IncidentNo] AS incidentId,
               ID.[IncidentDocName] AS name,
               ID.[Injury] AS injury,
               ${dateTimeUtil.dbDate2utcDate('ID.[DateUploaded]', user.companyTimezone)} AS dateUploaded
			FROM [Incidents Documents] ID `;

	if (queryParams.incidentId != undefined) {
		query += `WHERE [IncidentNo] = ${parseInt(queryParams.incidentId)} `;
	} //else {
	//	query += `AND [IncidentNo] IS NULL `;
	//}

	query += `ORDER BY ID.[IncidentDocName]`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getList = getList;

async function get(user, id) {
	console.log('DB:incidentDocument.get(user, id)');
	console.log(`id: ${id}`);

	let query = ``;
	if (id !== undefined) {
		query = `SELECT
                ID.[IncidentDocNo] AS id,
                ID.[IncidentNo] AS incidentId,
                ID.[IncidentDocName] AS name,
                ID.[Injury] AS injury,
                ${dateTimeUtil.dbDate2utcDate('ID.[DateUploaded]', user.companyTimezone)} AS dateUploaded
                FROM [Incidents Documents] ID 
            WHERE ID.[IncidentDocNo] = ${id}`;
	}

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.get = get;

async function update(user, id, data) {
	console.log('DB:incidentDocument.update(user, id, data)');

	/*const fieldList = mapUtils.mapDataForUpdate2(data, dbField, user.companyTimezone, dateFields);

	const query = `UPDATE [Incidents Documents] 
                        SET ${fieldList}
                     WHERE [IncidentDocNo] = ${id}`;

	console.log(query);*/
	const keyValueList = mapDataForUpdate(data, dbModel, dbModel.primaryKey, user.companyTimezone);

	const stmt = `UPDATE ${dbModel.tableName} SET ${keyValueList}
					WHERE ${dbModel.primaryKey} = ${id}`;

	console.log(stmt);
	const result = await database.simpleExecute(stmt);
	//console.log(result);
	return result;
}
module.exports.update = update;

async function insert(user, data) {
	console.log('DB:incidentDocument.insert(user, data)');

	const res = { success: false };

	// Check mandatory fields
	if (data.name === undefined) {
		res.message = 'File Name is mandatory';
		return res;
	}

	// Insert record
	const { dateUploaded, ...data2 } = data; // remove dateUploaded if present using rest operator
	/*const [ fieldList, valueList ] = mapUtils.mapDataForInsert2(data2, dbField, user.companyTimezone, dateFields);
	const stmt = `INSERT INTO [Incidents Documents] (${fieldList},[DateUploaded]) OUTPUT INSERTED.[IncidentDocNo] AS id VALUES (${valueList},GETDATE())`;*/
	const [ fieldList, valueList ] = mapDataForInsert(data2, dbModel, dbModel.primaryKey, user.companyTimezone);
	//console.log(fields)
	const stmt = `INSERT INTO ${dbModel.tableName} (${fieldList},[DateUploaded]) OUTPUT INSERTED.${dbModel.primaryKey} AS id VALUES (${valueList},GETDATE());`;

	console.log(stmt);
	result = await database.simpleExecute(stmt);
	console.log(result);

	if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
		res.success = true;
		res.message = 'incident Document inserted successfully';
		res.id = result.recordset[0].id;
		return res;
	}

	res.message = 'Insert failed';
	return res;
}
module.exports.insert = insert;

async function remove(user, id) {
	console.log('DB:incidentDocument.remove(user, id)');

	let stmt = `DELETE FROM ${dbModel.tableName} OUTPUT DELETED.${dbModel.primaryKey} AS id 
				WHERE ${dbModel.primaryKey} = ${id}`;

	console.log(stmt);
	const result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}
module.exports.remove = remove;
