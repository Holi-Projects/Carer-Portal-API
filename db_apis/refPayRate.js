const database = require('../services/database.js');
const { listSqlStatement } = require('../utils/mapUtils');
const { dbModel } = require('../db_model/refPayRate.js');

// Get PayRate reference data on a GET HTTP request
async function getRefPayRate(user) {
	console.log('Run: function getRefPayRate(user) ');

	let query =
		'SELECT RTRIM([Pay Type Code]) AS code, [Pay Type Description] AS description, RTRIM([Pay Type Unit]) AS unit, multiplier, hourly ' +
		'FROM [Pay Rate Types] ' +
		`WHERE CompanyID = ${user.companyId} ` +
		'ORDER BY [Display Seq]';
	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.getRefPayRate = getRefPayRate;

async function list(user) {
	console.log('DB:refPayRate.list(user) ');

	let query = listSqlStatement(user, dbModel);
	query += 'ORDER BY [Display Seq]';

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.list = list;

// strip trailing space from result in the controller
