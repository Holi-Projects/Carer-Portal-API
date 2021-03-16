const database = require('../services/database.js');
const { listSqlStatement, getSqlStatement } = require('../utils/mapUtils');
const { dbModel } = require('../db_model/refShiftType.js');

async function list(user) {
	//console.log('DB:refShiftType.list(user) ');

	let query = listSqlStatement(user, dbModel);
	query += 'ORDER BY [DisplaySeqNo]';
	//console.log(query);

	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.list = list;

async function get(user, id) {
	//console.log('DB:refShiftType.get(user, id) ');
	//console.log(`id: ${id}`);

	const query = getSqlStatement(user, dbModel, id);
	//console.log(query);

	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.get = get;
