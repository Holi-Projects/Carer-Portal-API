const database = require('../services/database.js');
/*const mapUtils = require('../utils/mapUtils');

const dbFieldMap = {
	id                   : '[AgencyClientTaskNo]',
	fundingArrangementId : '[AgencyClientSeqNo]',
	taskId               : '[Task ID]',
	obsolete             : '[Obsolete]',
};*/
const { mapDataForSelect, mapDataForInsert, mapDataForUpdate } = require('../utils/mapUtils');
const { dbModel } = require('../db_model/fundingArrangementTask.js');

async function getList(user, fundingArrangementId) {
	console.log('DB:fundingArrangementTask.getList(user, fundingArrangementId)');
	console.log(`fundingArrangementId: ${fundingArrangementId}`);

	let query = ``;
	if (fundingArrangementId !== undefined) {
		query = `SELECT 
				ACT.[AgencyClientTaskNo] AS id,
				ACT.[AgencyClientSeqNo] AS fundingArrangementId,
				ACT.[Task ID] AS taskId,
				T.[Task Name] AS taskName,
				ACT.[Obsolete] AS obsolete
			FROM [Agencies Clients Tasks] ACT
			JOIN [Tasks] T ON T.[ID] = ACT.[Task ID]
			WHERE ACT.[AgencyClientSeqNo] = ${fundingArrangementId} 
			ORDER BY T.[Task Name]`;
	}

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getList = getList;

async function get(user, id) {
	console.log('DB:fundingArrangementTask.get(user, id)');
	console.log(`id: ${id}`);

	let query = ``;
	if (id !== undefined) {
		query = `SELECT 
				ACT.[AgencyClientTaskNo] AS id,
				ACT.[AgencyClientSeqNo] AS fundingArrangementId,
				ACT.[Task ID] AS taskId,
				T.[Task Name] AS taskName,
				ACT.[Obsolete] AS obsolete
			FROM [Agencies Clients Tasks] ACT
			JOIN [Tasks] T ON T.[ID] = ACT.[Task ID]
			WHERE ACT.[AgencyClientTaskNo] = ${id}`;
	}

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.get = get;

async function update(user, fundingArrangementId, id, data) {
	console.log('DB:fundingArrangementTask.update(user, fundingArrangementId, id, data)');

	/*const fieldList = mapUtils.mapDataForUpdate2(data, dbFieldMap);

	const query = `UPDATE [Agencies Clients Tasks] 
                        SET ${fieldList}
                     WHERE [AgencyClientTaskNo] = ${id} 
                       AND [AgencyClientSeqNo] = ${fundingArrangementId}`;*/

	let keyValueList = mapDataForUpdate(data, dbModel, dbModel.primaryKey, user.companyTimezone);

	const stmt = `UPDATE ${dbModel.tableName} SET ${keyValueList}
				 WHERE ${dbModel.primaryKey} = ${id} AND [AgencyClientSeqNo] = ${fundingArrangementId}`;

	console.log(stmt);

	const result = await database.simpleExecute(stmt);
	//console.log(result);
	return result;
}
module.exports.update = update;

async function insert(user, data) {
	console.log('DB:fundingArrangementTask.insert(user, data)');

	// TODO: Duplicate Detection -- rules need to be defined.

	/*let fields = [];
	let values = [];
	for (let [ key, value ] of Object.entries(data)) {
		console.log(key, value);

		const dbFieldName = dbField[key];
		if (value && dbFieldName && dbFieldName !== '[CarerSkillNo]') {
			if (typeof value === 'string') value = `'${value}'`; // strings need to single quoted in SQL
			if (typeof value === 'boolean') value = value ? 1 : 0; // booleans need to be translated from true/false to 1/0 in SQL
			if (dateFields.includes(dbFieldName)) value = dateTimeUtil.utcDate2dbDate(value, user.companyTimezone);

			fields.push(dbFieldName);
			values.push(value);
		}
	}
	const fieldList = fields.join();
	const valueList = values.join();*/

	/*const [ fieldList, valueList ] = mapDataForInsert2(data, dbFieldMap);
	const stmt = `INSERT INTO [Agencies Clients Tasks] (${fieldList}) OUTPUT INSERTED.[CarerSkillNo] AS id VALUES (${valueList});`;*/

	let [ fieldList, valueList ] = mapDataForInsert(data, dbModel, dbModel.primaryKey, user.companyTimezone);
	const stmt = `INSERT INTO ${dbModel.tableName} ([CompanyID],${fieldList}) OUTPUT INSERTED.${dbModel.primaryKey} AS id VALUES (${user.companyId},${valueList});`;
	console.log(stmt);

	result = await database.simpleExecute(stmt);
	console.log(result);
	/*} else {
		console.log('Duplicate detected');
	}*/
	return result;
}
module.exports.insert = insert;

async function remove(user, fundingArrangementId, id) {
	console.log('DB:fundingArrangementTask.remove(user, fundingArrangementId, id)');

	let query = `DELETE FROM [Agencies Clients Tasks] 
        OUTPUT DELETED.[AgencyClientTaskNo] AS id 
        WHERE [AgencyClientSeqNo] = ${fundingArrangementId}
        AND [AgencyClientTaskNo] = ${id}`;

	console.log(query);
	const result = await database.simpleExecute(query);
	console.log(result);
	return result;
}
module.exports.remove = remove;
