const database = require('../services/database.js');
const { listSqlStatement } = require('../utils/mapUtils');
const { dbModel } = require('../db_model/refClient.js');

async function getRefClient(user, queryParams) {
	console.log('Run: function getRefClient() ');

	// First determine ORDER BY clause based on system parameters
	let orderBy = 'ORDER BY C.[Last Name], C.[First Name]';
	let query = `SELECT RTRIM([Sort Clients]) AS sortClients FROM [System Parameters] WHERE [CompanyID] = ${user.companyId}`;
	const res = await database.simpleExecute(query);
	console.log('sortClients: ' + res.recordset[0].sortClients);
	if (res.recordset[0].sortClients === 'First Name') {
		orderBy = 'ORDER BY C.[First Name], C.[Last Name]';
	}

	query = ``;
	if (queryParams.toDate !== undefined && queryParams.toDate !== 'null') {
		query += `DECLARE @toDate date ='` + queryParams.toDate + `'`;
	}

	query = `SELECT DISTINCT
                C.[ID] AS id, 
                C.[First Name] AS firstName,
                C.[Last Name] AS lastName,
                C.[First Name] + ' ' + C.[Last Name] AS name, 
                C.[Last Name] + ', ' +  C.[First Name] AS name2
			FROM [Clients] C `;

	if (user.userType === 'carer')
		query += `JOIN [Bookings] B ON B.[Client ID] = C.[ID] AND B.[Carer ID] = ${user.userId} `;

	query += `WHERE C.[CompanyID] = ${user.companyId} `;

	if (queryParams.toDate !== undefined && queryParams.toDate !== 'null') {
		query += `AND (C.[Service Finish Date] IS NULL OR (C.[Service Finish Date] > @toDate)) AND C.Deceased = 0 `;
	} else {
		query += `AND (C.[Service Finish Date] IS NULL OR (C.[Service Finish Date] > GetDate())) AND C.Deceased = 0 `;
	}
	query += orderBy;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.getRefClient = getRefClient;

async function list(user, queryParams) {
	console.log('DB:refClient:list(user, queryParams) ');

	let query = `SELECT RTRIM([Sort Clients]) AS sortClients FROM [System Parameters] WHERE [CompanyID] = ${user.companyId}`;
	const res = await database.simpleExecute(query);
	console.log('sortClients: ' + res.recordset[0].sortClients);

	// First determine ORDER BY clause based on system parameters
	let orderBy = 'ORDER BY C.[Last Name], C.[First Name]';
	if (res.recordset[0].sortClients === 'First Name') orderBy = 'ORDER BY C.[First Name], C.[Last Name]';

	query = listSqlStatement(user, dbModel, 'C');

	if (user.userType === 'carer')
		query += `JOIN [Bookings] B ON B.[Client ID] = C.[ID] AND B.[Carer ID] = ${user.userId} `;

	if (queryParams.toDate !== undefined && queryParams.toDate !== 'null')
		query += `AND (C.[Service Finish Date] IS NULL OR (C.[Service Finish Date] > '${queryParams.toDate}')) AND C.Deceased = 0 `;
	else query += `AND (C.[Service Finish Date] IS NULL OR (C.[Service Finish Date] > GetDate())) AND C.Deceased = 0 `;

	query += orderBy;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.list = list;
