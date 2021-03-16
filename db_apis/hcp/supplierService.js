const database = require('../../services/database.js');
const { mapDataForSelect, mapDataForInsert, mapDataForUpdate } = require('../../utils/mapUtils');
const { dbModel } = require('../../db_model/hcp/supplierService.js');

async function list(user, queryParams) {
	console.log('DB:supplierService.list(user, queryParams)');
	let query = ``;
	let fieldList = mapDataForSelect('A', dbModel, dbModel.primaryKey, user.companyTimezone);

	query = `SELECT 
				${fieldList},
				B.[First Name] + ' ' + B.[Last Name] AS clientName,
				B.[Job Ref] AS clientJobRef,
				C.[SupplierName] AS supplierName,
				C.[Address] AS supplierAddress,
				C.[City] AS supplierCity,
				C.[State] AS supplierState,
				C.[PostalCode] AS supplierPostcode
			FROM ${dbModel.tableName} A
            JOIN Clients B ON B.[ID] = A.[ClientID] 
            JOIN Supplier C ON C.[SupplierID] = A.[SupplierID] `;

	let where = `WHERE B.[CompanyID] = ${user.companyId} `;

	if (queryParams.clientId) {
		where += `AND A.[ClientID] =  ${queryParams.clientId} `;
	}

	if (queryParams.startDate) {
		where += `AND A.[InvoiceDate] >=  '${queryParams.startDate}' `;
	}

	if (queryParams.endDate) {
		where += `AND A.[InvoiceDate] <=  '${queryParams.endDate}' `;
	}

	query += where;

	query += `ORDER BY A.[InvoiceDate], C.[SupplierName]`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.list = list;

async function get(user, id) {
	console.log('DB:supplierService.get(user, id)');
	console.log(`id: ${id}`);

	let query = ``;
	if (id !== undefined) {
		let fieldList = mapDataForSelect('A', dbModel, dbModel.primaryKey, user.companyTimezone);

		query = `SELECT ${fieldList}
                FROM ${dbModel.tableName} A
                WHERE A.${dbModel.primaryKey} = ${id}`;
	}

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.get = get;

async function update(user, id, data) {
	console.log('DB:supplierService.update(user, id, data)');

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
	console.log('DB:supplierService.insert(user, data)');

	let [ fieldList, valueList ] = mapDataForInsert(data, dbModel, dbModel.primaryKey, user.companyTimezone);
	//console.log(fields)
	const stmt = `INSERT INTO ${dbModel.tableName} (${fieldList}) OUTPUT INSERTED.${dbModel.primaryKey} AS id VALUES (${valueList});`;

	console.log(stmt);
	result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}
module.exports.insert = insert;

async function remove(user, id) {
	console.log('DB:supplierService.remove(user, id)');

	const stmt = `DELETE FROM ${dbModel.tableName} OUTPUT DELETED.${dbModel.primaryKey} AS id 
                    WHERE ${dbModel.primaryKey} = ${id}`;

	console.log(stmt);
	const result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}
module.exports.remove = remove;

async function totalAmount(user, clientId, date) {
	console.log('DB:supplierService.totalAmount(user, clientId, date)');

	let query = `SELECT
				SUM(SS.[TotalAmount]) AS totalAmount
				FROM SupplierServices SS
				JOIN Clients C ON C.[ID] = SS.[ClientID] AND C.[CompanyID] = ${user.companyId}
				JOIN Supplier S ON S.[SupplierID] = SS.[SupplierID] AND S.[CompanyID] = ${user.companyId}
				WHERE SS.[ClientID] = ${clientId}
				AND '${date}' = SS.[InvoiceDate]`;

	//console.log(query);
	const result = await database.simpleExecute(query);

	if (result.recordset.length > 0 && result.recordset[0].totalAmount != null) return result.recordset[0].totalAmount;

	return 0;
}
module.exports.totalAmount = totalAmount;
