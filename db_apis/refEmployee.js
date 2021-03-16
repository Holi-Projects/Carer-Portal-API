const database = require('../services/database.js');
const { listSqlStatement } = require('../utils/mapUtils');
const { dbModel } = require('../db_model/refEmployee.js');

async function getRefEmployee(user) {
	console.log('Run: function getRefEmployee(user)');

	let query = `SELECT
					[ID] AS id,
					[First Name] + ' ' +  [Last Name] AS name
				FROM Employees 
				WHERE [Termination Date] IS NULL AND [CompanyID] = ${user.companyId} 
				ORDER BY [First Name], [Last Name]`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.getRefEmployee = getRefEmployee;

async function list(user) {
	console.log('DB:refEmployee.list(user) ');

	let query = listSqlStatement(user, dbModel);
	query += 'AND [Termination Date] IS NULL ORDER BY [First Name], [Last Name]';

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.list = list;
