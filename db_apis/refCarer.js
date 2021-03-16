const database = require('../services/database.js');
const { listSqlStatement } = require('../utils/mapUtils');
const { dbModel } = require('../db_model/refCarer.js');

async function getList(user) {
	console.log('DB:refCarer:getList() ');

	// First determine ORDER BY clause based on system parameters
	let orderBy = 'ORDER BY C.[Last Name], C.[First Name]';
	let query = `SELECT RTRIM([Sort Carers]) AS sortCarers FROM [System Parameters] WHERE [CompanyID] = ${user.companyId}`;
	const res = await database.simpleExecute(query);
	console.log('sortCarers: ' + res.recordset[0].sortCarers);
	if (res.recordset[0].sortCarers === 'First Name') {
		orderBy = 'ORDER BY C.[First Name], C.[Last Name]';
	}

	query = `SELECT DISTINCT
                C.[ID] AS id, 
                C.[First Name] AS firstName,
                C.[Last Name] AS lastName,
                C.[First Name] + ' ' + C.[Last Name] AS name, 
                C.[Last Name] + ', ' +  C.[First Name] AS name2
			FROM [Carers] C `;

	query += `WHERE C.[CompanyID] = ${user.companyId} `;

	query += `AND (C.[Available To Date] IS NULL OR (C.[Available To Date] > GETDATE())) AND [Deceased] = 0  `;

	query += orderBy;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.getList = getList;

async function list(user) {
	console.log('DB:refCarer:list(user) ');

	// First determine ORDER BY clause based on system parameters
	let orderBy = 'ORDER BY C.[Last Name], C.[First Name]';
	let query = `SELECT RTRIM([Sort Carers]) AS sortCarers FROM [System Parameters] WHERE [CompanyID] = ${user.companyId}`;
	const res = await database.simpleExecute(query);
	console.log('sortCarers: ' + res.recordset[0].sortCarers);

	if (res.recordset[0].sortCarers === 'First Name') orderBy = 'ORDER BY C.[First Name], C.[Last Name]';

	query = listSqlStatement(user, dbModel, 'C');
	query += 'AND (C.[Available To Date] IS NULL OR (C.[Available To Date] > GETDATE())) AND [Deceased] = 0 ';
	query += orderBy;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.list = list;
