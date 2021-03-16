const database = require('../../services/database.js');
const { mapDataForSelect, mapDataForInsert, mapDataForUpdate } = require('../../utils/mapUtils');
const { dbModel } = require('../../db_model/hcp/supplier.js');
const refPostCode = require('../refPostCode.js');

async function list(user) {
	console.log('DB:supplier.list(user)');
	let query = ``;
	let fieldList = mapDataForSelect('A', dbModel, dbModel.primaryKey, user.companyTimezone);

	query = `SELECT 
                ${fieldList},
                A.[City] + ' ' + A.[State] + ' ' + A.[PostalCode] AS locality2,
                P.[ID] AS localityId
            FROM ${dbModel.tableName} A
            LEFT JOIN [Post Codes AU] P ON A.[City] = P.[Locality] AND P.[State] = A.[State] AND P.[PCode] = A.[PostalCode]
            WHERE A.${dbModel.dataFields.companyId} = ${user.companyId}
            ORDER BY [SupplierName]`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.list = list;

async function get(user, id) {
	console.log('DB:supplier.get(user, id)');
	console.log(`id: ${id}`);

	let query = ``;
	if (id !== undefined) {
		let fieldList = mapDataForSelect('A', dbModel, dbModel.primaryKey, user.companyTimezone);

		query = `SELECT 
                    ${fieldList},
                    P.[ID] AS localityId
                FROM ${dbModel.tableName} A
                LEFT JOIN [Post Codes AU] P ON A.[City] = P.[Locality] AND P.[State] = A.[State] AND P.[PCode] = A.[PostalCode]
				WHERE A.${dbModel.dataFields.companyId} = ${user.companyId}
				  AND A.${dbModel.primaryKey} = ${id}`;
	}

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.get = get;

async function update(user, id, data) {
	console.log('DB:supplier.update(user, id, data)');

	if (data.localityId) {
		const rows = await refPostCode.getRefPostCode(user, data.localityId);
		if (rows.length === 1) {
			data.locality = rows[0].localityLower;
			data.state = rows[0].state;
			data.postcode = rows[0].postcode;
		}
	}

	let keyValueList = mapDataForUpdate(data, dbModel, dbModel.primaryKey, user.companyTimezone);

	const stmt = `UPDATE ${dbModel.tableName} SET ${keyValueList}
                    WHERE ${dbModel.dataFields.companyId} = ${user.companyId}
                    AND ${dbModel.primaryKey} = ${id}`;

	console.log(stmt);
	const result = await database.simpleExecute(stmt);
	//console.log(result);
	return result;
}
module.exports.update = update;

async function insert(user, data) {
	console.log('DB:supplier.insert(user, data)');

	if (data.localityId) {
		const rows = await refPostCode.getRefPostCode(user, data.localityId);
		if (rows.length === 1) {
			data.locality = rows[0].localityLower;
			data.state = rows[0].state;
			data.postcode = rows[0].postcode;
		}
	}

	let [ fieldList, valueList ] = mapDataForInsert(data, dbModel, dbModel.primaryKey, user.companyTimezone);
	//console.log(fields)
	const stmt = `INSERT INTO ${dbModel.tableName} ([CompanyID],${fieldList}) OUTPUT INSERTED.${dbModel.primaryKey} AS id VALUES (${user.companyId},${valueList});`;

	console.log(stmt);
	result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}
module.exports.insert = insert;

async function remove(user, id) {
	console.log('DB:supplier.remove(user, id)');

	const stmt = `DELETE FROM ${dbModel.tableName} OUTPUT DELETED.${dbModel.primaryKey} AS id 
                    WHERE ${dbModel.primaryKey} = ${id} 
                      AND ${dbModel.dataFields.companyId} = ${user.companyId}`;
	console.log(stmt);
	const result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}
module.exports.remove = remove;
