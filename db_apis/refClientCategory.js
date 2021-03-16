const database = require('../services/database.js');
const { listSqlStatement } = require('../utils/mapUtils');
const { dbModel } = require('../db_model/refClientCategory.js');

// Get client categories reference data on a GET HTTP request
async function getRefClientCategory(user) {
	console.log('Run: function getRefClientCategory(user) ');

	let query =
		'SELECT ClientCategoryNo AS id, ClientCategoryName AS name, ClientColour AS colour ' +
		'FROM [Ref Client Categories] ' +
		'WHERE [CompanyID] = ' +
		user.companyId +
		' ORDER BY ClientCategoryName';
	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.getRefClientCategory = getRefClientCategory;

async function list(user) {
	console.log('DB:getRefClientCategory.list(user)');

	let query = listSqlStatement(user, dbModel);
	query += ' ORDER BY [ClientCategoryName]';

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.list = list;
