const database = require('../services/database.js');

// Get a combined list of active client and agency names that can act as funding sources
async function getList(user) {
	console.log('Run: function getList(user) ');

	let rows = [];

	let query = `
        SELECT
            'Client' AS type,
            'C' + CAST(ID AS VARCHAR(10)) AS id,
            [Last Name] + ', ' + [First Name] + CASE WHEN [City] IS NOT NULL THEN ' (' + [City] + ')' ELSE '' END AS name,
            [City] AS locality
        FROM Clients
        WHERE CompanyID = ${user.companyId}
        AND ([Service Finish Date] IS NULL OR ([Service Finish Date] > GetDate())) AND Deceased = 0
        ORDER BY name`;

	console.log(query);
	let result = await database.simpleExecute(query);
	rows = rows.concat(result.recordset);

	query = `
        SELECT
            'Agency' AS type,
            'A' + CAST(ID AS VARCHAR(10)) AS id,
            [Company] + CASE WHEN [City] IS NOT NULL THEN ' (' + [City] + ')' ELSE '' END AS name,
            [City] AS locality
        FROM Agencies
        WHERE CompanyID = ${user.companyId}
        ORDER BY name`;

	console.log(query);
	result = await database.simpleExecute(query);
	rows = rows.concat(result.recordset);

	return rows;
}

module.exports.getList = getList;
