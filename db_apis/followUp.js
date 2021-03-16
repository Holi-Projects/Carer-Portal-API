const database = require('../services/database.js');

// Get high level followup information
async function getFollowUps(user, filters) {
	console.log('Run: function getFollowUps(filters)');

	let query =
		'SELECT ' +
		'H.id, ' +
		'H.[Client ID] AS clientId, ' +
		'C.[First Name] AS clientFirstName, ' +
		'C.[Last Name] AS clientLastName, ' +
		'H.[Agency ID] AS agencyId, ' +
		'A.[Company] AS agencyName, ' +
		'H.[Carer ID] AS carerId, ' +
		'R.[First Name] AS carerFirstName, ' +
		'R.[Last Name] AS carerLastName, ' +
		'H.[Employee ID] AS employeeId, ' +
		'E.[First Name] AS employeeFirstName, ' +
		'E.[Last Name] AS employeeLastName, ' +
		//'H.clientPlanIssueId, '+
		"FORMAT(H.[History Date], 'dd/MM/yyyy') AS historyDate, " +
		'H.comments, ' +
		'H.[Follow Up] AS followUp, ' +
		"FORMAT(H.[Follow Up Date], 'dd/MM/yyyy hh:mm:ss') AS followUpDateTime, " +
		'H.[Follow Up Complete] AS followUpComplete, ' +
		"FORMAT(H.[Date Added], 'dd/MM/yyyy hh:mm:ss') AS addedDateTime, " +
		"FORMAT(H.[Date Changed], 'dd/MM/yyyy hh:mm:ss') AS changedDateTime, " +
		'H.[Print On Roster] AS printOnRoster ' +
		'FROM [Contact History] H ' +
		'LEFT JOIN Clients C ON C.ID = H.[Client ID] ' +
		'LEFT JOIN Agencies A ON A.ID = H.[Agency ID] ' +
		'LEFT JOIN Carers R ON R.ID = H.[Carer ID] ' +
		'LEFT JOIN Employees E ON E.ID = H.[Employee ID] ' +
		'WHERE H.[Follow Up] IS NOT NULL ' +
		'AND H.[CompanyID] = ' +
		user.companyId +
		' ';

	if (filters.employeeId) {
		query += 'AND H.[Employee ID] = ' + filters.employeeId + ' ';
	}

	if (!filters.includeComplete) {
		query += 'AND H.[Follow Up Complete] = 0 ';
	}

	query += 'ORDER BY H.[Follow Up Date]';

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.getFollowUps = getFollowUps;
