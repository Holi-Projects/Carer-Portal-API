const database = require('../services/database.js');
const { listSqlStatement } = require('../utils/mapUtils');
const { dbModel } = require('../db_model/refMedicineAdminCode.js');

// Get MedicineAdminCode reference data on a GET HTTP request
async function getRefMedicineAdminCode() {
	console.log('Run: function getRefMedicineAdminCode() ');

	let query =
		'SELECT AbbrevCode AS code, AbbrevDescription AS description FROM [Ref Medicine Administration Codes] ORDER BY description';
	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.getRefMedicineAdminCode = getRefMedicineAdminCode;

async function list(user) {
	console.log('DB:refMedicineAdminCode.list(user) ');

	let query = listSqlStatement(user, dbModel);
	query += 'ORDER BY description';

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.list = list;
