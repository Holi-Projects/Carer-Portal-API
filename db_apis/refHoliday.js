const database = require('../services/database.js');
const { listSqlStatement } = require('../utils/mapUtils');
const { dbModel } = require('../db_model/refHoliday.js');

// Get holiday reference data on a GET HTTP request
async function getRefHoliday(user, year) {
	console.log('Run: function getRefHoliday(user, year) ');

	let query =
		'SELECT ' +
		'HolidayId AS id,' +
		'HolidayName AS name,' +
		"FORMAT(HolidayDateStart, 'dd/MM/yyyy') AS startDate," +
		"FORMAT(HolidayDateEnd, 'dd/MM/yyyy') AS endDate," +
		'[School Holiday] AS schoolHoliday ' +
		'FROM Holidays ' +
		`WHERE CompanyID = ${user.companyId} `;

	if (year) {
		query += `AND FORMAT(HolidayDateStart, 'yyyy') = '${year}' `;
	}

	query += 'ORDER BY HolidayDateStart';

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.getRefHoliday = getRefHoliday;

async function list(user, queryParams) {
	console.log('DB:refHoliday.list(user, queryParams) ');

	let query = listSqlStatement(user, dbModel);

	if (queryParams) query += `AND YEAR(HolidayDateStart) = ${queryParams.year} `;

	query += 'ORDER BY HolidayDateStart';

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.list = list;
