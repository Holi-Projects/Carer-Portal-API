const database = require('../../services/database.js');
const { mapDataForSelect, mapDataForInsert, mapDataForUpdate } = require('../../utils/mapUtils');
const { dbModel } = require('../../db_model/hcp/clientMonthlyStatement.js');

async function list(user, queryParams) {
	console.log('DB:clientMonthlyStatement.list(user)');
	let query = ``;
	const fieldList = mapDataForSelect('A', dbModel, dbModel.primaryKey, user.companyTimezone);

	query = `SELECT 
                ${fieldList}
            FROM ${dbModel.tableName} A
            JOIN Clients B ON B.[ID] = A.[ClientID] `;

	let where = `WHERE B.[CompanyID] = ${user.companyId} `;

	console.log(queryParams);
	if (queryParams.year && queryParams.month) {
		where += `AND YEAR(A.[Date]) = ${queryParams.year} AND MONTH(A.[Date]) = ${queryParams.month} `;
	}
	if (queryParams.clientId) {
		where += `AND A.ClientID = ${queryParams.clientId} `;
	}

	query += where;

	query += `ORDER BY A.[Date], B.[Last Name], B.[First Name], B.[ID]`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.list = list;

async function get(user, id) {
	console.log('DB:clientMonthlyStatement.get(user, id)');
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
	console.log('DB:clientMonthlyStatement.update(user, id, data)');

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
	console.log('DB:clientMonthlyStatement.insert(user, data)');

	//  Start transaction
	let stmt = database.startTransaction;

	stmt += `DELETE FROM ${dbModel.tableName} 
				WHERE [ClientID] = ${data.clientId}
				AND [Month] = ${data.month}
				AND [Year] = ${data.year};\n`;

	let [ fieldList, valueList ] = mapDataForInsert(data, dbModel, dbModel.primaryKey, user.companyTimezone);
	stmt += `INSERT INTO ${dbModel.tableName} (${fieldList}) VALUES (${valueList});\n`;

	// Commit the transaction
	stmt += database.endTransaction;
	console.log(stmt);
	result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}
module.exports.insert = insert;

async function remove(user, id) {
	console.log('DB:clientMonthlyStatement.remove(user, id)');

	const stmt = `DELETE A 
                    FROM ${dbModel.tableName} A 
                    JOIN CLIENTS B ON B.[ID] = A.[ClientID] 
                    OUTPUT DELETED.${dbModel.primaryKey} AS id 
                    WHERE ${dbModel.primaryKey} = ${id} 
                    AND B.[CompanyID] = ${user.companyId}`;
	//const stmt = `DELETE FROM ${dbModel.tableName} OUTPUT DELETED.${dbModel.primaryKey} AS id
	//                WHERE ${dbModel.primaryKey} = ${id}`;

	console.log(stmt);
	const result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}
module.exports.remove = remove;

async function removeBlock(user, year, month, clientId) {
	console.log('DB:clientMonthlyStatement.removeBlock(user, year, month, clientId)');

	let stmt = `DELETE A 
                    FROM ${dbModel.tableName} A 
                    JOIN CLIENTS B ON B.[ID] = A.[ClientID] 
                    WHERE B.[CompanyID] = ${user.companyId}
                      AND A.[Year] = ${year}
                      AND A.[Month] = ${month}`;

	if (clientId !== undefined) {
		stmt += ` AND A.[ClientID] = ${clientId}`;
	}

	console.log(stmt);
	const result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}
module.exports.removeBlock = removeBlock;

async function previousBalance(user, clientId, year, month) {
	console.log('DB:clientMonthlyStatement.previousBalance(user, clientId, year, month)');

	const previousMonth = month === 1 ? 12 : month - 1;
	const previousYear = month === 1 ? year - 1 : year;

	const query = `SELECT
                A.[ClientId] AS clientId,
                A.[Year] AS year,
                A.[Month] AS month,
                A.[CloseBalance] AS closeBalance
            FROM ${dbModel.tableName} A
            JOIN Clients B ON B.[ID] = A.[ClientID]
            WHERE B.[CompanyID] = ${user.companyId}
              AND A.[Year] = ${previousYear}
              AND A.[Month] = ${previousMonth}
              AND A.[ClientID] = ${clientId}`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.previousBalance = previousBalance;
