const database = require('../../services/database.js');
const { mapDataForSelect, mapDataForInsert, mapDataForUpdate } = require('../../utils/mapUtils');
const { dbModel } = require('../../db_model/hcp/hcpLevel.js');

async function list(user) {
	console.log('DB:hcpLevel.list(user)');
	let query = ``;
	let fieldList = mapDataForSelect('A', dbModel, dbModel.primaryKey, user.companyTimezone);

	/*query = `SELECT ${fieldList} FROM ${dbModel.tableName} A
            WHERE A.${dbModel.dataFields.companyId} = ${user.companyId}
            ORDER BY [Name]`;*/
	query = `SELECT ${fieldList} FROM ${dbModel.tableName} A
            ORDER BY [Name]`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.list = list;

async function get(user, id) {
	console.log('DB:hcpLevel.get(user, id)');
	console.log(`id: ${id}`);

	let query = ``;
	if (id !== undefined) {
		let fieldList = mapDataForSelect('A', dbModel, dbModel.primaryKey, user.companyTimezone);

		/*query = `SELECT ${fieldList} FROM ${dbModel.tableName} A
                    WHERE A.${dbModel.dataFields.companyId} = ${user.companyId}
                    AND A.${dbModel.primaryKey} = ${id}`;*/
		query = `SELECT ${fieldList} FROM ${dbModel.tableName} A
                    WHERE A.${dbModel.primaryKey} = ${id}`;
	}

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.get = get;

async function update(user, id, data) {
	console.log('DB:hcpLevel.update(user, id, data)');

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
	console.log('DB:hcpLevel.insert(user, data)');
	let [ fieldList, valueList ] = mapDataForInsert(data, dbModel, dbModel.primaryKey, user.companyTimezone);
	//console.log(fields)
	//const stmt = `INSERT INTO ${dbModel.tableName} ([CompanyID],${fieldList}) OUTPUT INSERTED.${dbModel.primaryKey} AS id VALUES (${user.companyId},${valueList});`;
	const stmt = `INSERT INTO ${dbModel.tableName} (${fieldList}) OUTPUT INSERTED.${dbModel.primaryKey} AS id VALUES (${valueList});`;

	console.log(stmt);
	result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}
module.exports.insert = insert;

async function remove(user, id) {
	console.log('DB:hcpLevel.remove(user, id)');

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
