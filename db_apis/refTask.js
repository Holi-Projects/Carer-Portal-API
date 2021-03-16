const database = require('../services/database.js');
const { listSqlStatement } = require('../utils/mapUtils');
const { dbModel } = require('../db_model/refTask.js');

// Get agency reference data on a GET HTTP request
async function getRefTask(user) {
	console.log('Run: function getRefTask(user) ');

	let query = `SELECT ID as id, [Title] as taskName, RTRIM([Task Name]) as taskCode , CONCAT(RTRIM([Task Name]),' (', [Title],')' ) as taskNameAndCode 
				FROM Tasks 
				WHERE CompanyID = ${user.companyId} AND Inactive = 0 
				ORDER BY Title `;
	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.getRefTask = getRefTask;

async function list(user) {
	console.log('DB:refTask.list(user) ');

	let query = listSqlStatement(user, dbModel);
	query += 'AND Inactive = 0 ORDER BY [Title]';

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.list = list;
