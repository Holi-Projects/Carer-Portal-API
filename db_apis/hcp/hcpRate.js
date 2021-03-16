const database = require('../../services/database.js');
const { mapDataForSelect, mapDataForInsert, mapDataForUpdate } = require('../../utils/mapUtils');
const { dbModel } = require('../../db_model/hcp/hcpRate.js');

async function list(user) {
	console.log('DB:hcpRate.list(user)');
	let query = ``;
	let fieldList = mapDataForSelect('A', dbModel, dbModel.primaryKey, user.companyTimezone);

	query = `SELECT 
                ${fieldList}, 
                'Financial Year (' + FORMAT(B.[startDate], 'dd-MM-yyyy') + ' -> ' + FORMAT(B.[endDate], 'dd-MM-yyyy') + ')' AS financialYear
                --'Financial Year (' + FORMAT(B.[startDate], 'dd-MM-yyyy') + ' -> ' + FORMAT(B.[endDate], 'dd-MM-yyyy') + ')' AS financialYear,
				-- startDate and endDate are now sourced from HCPRate table itself
                --B.startDate AS startDate, 
                --B.endDate AS endDate 
            FROM ${dbModel.tableName} A
            JOIN [FinancialYear] B ON B.[FinancialYearID] = A.[FinancialYearID]
            ORDER BY financialYear DESC, A.[HCPLevelCode]`;

	//console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.list = list;

async function get(user, id) {
	console.log('DB:hcpRate.get(user, id)');
	console.log(`id: ${id}`);

	let query = ``;
	if (id !== undefined) {
		let fieldList = mapDataForSelect('A', dbModel, dbModel.primaryKey, user.companyTimezone);

		query = `SELECT ${fieldList} FROM ${dbModel.tableName} A
                    WHERE A.${dbModel.primaryKey} = ${id}`;
	}

	//console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.get = get;

async function update(user, id, data) {
	console.log('DB:hcpRate.update(user, id, data)');

	let keyValueList = mapDataForUpdate(data, dbModel, dbModel.primaryKey, user.companyTimezone);

	const stmt = `UPDATE ${dbModel.tableName} SET ${keyValueList}
                    WHERE ${dbModel.primaryKey} = ${id}`;

	//console.log(stmt);
	const result = await database.simpleExecute(stmt);
	//console.log(result);
	return result;
}
module.exports.update = update;

async function insert(user, data) {
	console.log('DB:hcpRate.insert(user, data)');
	let [ fieldList, valueList ] = mapDataForInsert(data, dbModel, dbModel.primaryKey, user.companyTimezone);
	//console.log(fields)
	const stmt = `INSERT INTO ${dbModel.tableName} (${fieldList}) OUTPUT INSERTED.${dbModel.primaryKey} AS id VALUES (${valueList});`;

	//console.log(stmt);
	result = await database.simpleExecute(stmt);
	//console.log(result);
	return result;
}
module.exports.insert = insert;

async function remove(user, id) {
	console.log('DB:hcpRate.remove(user, id)');

	const stmt = `DELETE FROM ${dbModel.tableName} OUTPUT DELETED.${dbModel.primaryKey} AS id 
                    WHERE ${dbModel.primaryKey} = ${id}`;

	//console.log(stmt);
	const result = await database.simpleExecute(stmt);
	//console.log(result);
	return result;
}
module.exports.remove = remove;
