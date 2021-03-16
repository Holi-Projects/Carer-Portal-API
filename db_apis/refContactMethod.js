const database = require('../services/database.js');
const { listSqlStatement } = require('../utils/mapUtils');
const { dbModel } = require('../db_model/refContactMethod.js');

// Get contact method reference data on a GET HTTP request
async function getRefContactMethod() {
	console.log('Run: function getRefContactMethod() ');

	let query = 'SELECT RTRIM([Contact Method]) AS contactMethod FROM [Contact Methods] ORDER BY contactMethod';
	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.getRefContactMethod = getRefContactMethod;

async function list(user) {
	console.log('DB:refContactMethod.list() ');

	let query = listSqlStatement(user, dbModel);
	query += 'ORDER BY contactMethod';

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.list = list;
