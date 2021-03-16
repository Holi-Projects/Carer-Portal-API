const database = require('../services/database.js');
const { listSqlStatement } = require('../utils/mapUtils');
const { dbModel } = require('../db_model/refAgency.js');

// const dbField = {
// 	id   : '[ID]',
// 	name : '[Company]',
// };

function parseSearchCondition(expr, operation, value) {
	// translate to DB field name
	// let s = dbField[expr];
	let s = dbModel.dataFields[expr];
	//console.log(expr);

	if (operation === 'contains') s += ` LIKE '%${value}%' `;
	if (operation === 'startswith') s += ` LIKE '${value}%' `;

	return s;
}

// Get agency reference data on a GET HTTP request
async function getRefAgency(user, queryParams) {
	console.log('Run: function getRefAgency() ');
	console.log(queryParams);
	/*let query = `SELECT 
			[ID] AS id, 
			[Company] as name 
		FROM Agencies 
		WHERE [CompanyID] = ${user.companyId} `;*/
	let query = `SELECT 
		[ID] AS id, 
		[Company] as name 
	FROM Agencies 
	WHERE [CompanyID] = ${user.companyId} `;

	if (queryParams && queryParams.searchExpr && queryParams.searchOperation && queryParams.searchValue) {
		console.log(queryParams.searchExpr);
		console.log(queryParams.searchOperation);
		console.log(queryParams.searchValue);
		query += `AND ${parseSearchCondition(
			queryParams.searchExpr,
			queryParams.searchOperation,
			queryParams.searchValue
		)} `;
	}

	query += `ORDER BY [Company]`;

	console.log(query);

	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.getRefAgency = getRefAgency;

async function list(user, queryParams) {
	console.log('DB:refAgency.list(user, queryParams) ');
	console.log(queryParams);

	let query = listSqlStatement(user, dbModel);

	if (queryParams && queryParams.searchExpr && queryParams.searchOperation && queryParams.searchValue) {
		console.log(queryParams.searchExpr);
		console.log(queryParams.searchOperation);
		console.log(queryParams.searchValue);
		query += `AND ${parseSearchCondition(
			queryParams.searchExpr,
			queryParams.searchOperation,
			queryParams.searchValue
		)} `;
	}

	query += 'ORDER BY [Company]';

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.list = list;
