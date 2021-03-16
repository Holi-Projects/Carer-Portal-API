const database = require('../../services/database.js');
// const tools = require('../tools/tools.js');

// Get HCP client information on a GET HTTP request
async function getStatus(user, clientId) {
	console.log('Run: async function getStatus(context)');
	let query = `SELECT
				 [Service Start Date] AS ServiceStartDate, 
				 [Service Finish Date] AS ServiceFinishDate
	 			FROM [dbo].[Clients]
				WHERE [CompanyID] = ${user.companyId}
				  AND [ID] = ${clientId}`;

	//    console.log(query)
	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.getStatus = getStatus;

// Update service configuration for a PUT HTTP request
/*async function updateStatus(context, post) {
	let query = '';

	if (context.id !== undefined) {
		// let totalAmount = tools.formatNumber(post.itemAmount) + tools.formatNumber(post.itemGST);
		query +=
			`UPDATE [dbo].[Client]
        SET [ServiceStartDate] = ` +
			post.serviceStartDate +
			`,[ServiceFinishDate] = ` +
			post.serviceStartDate +
			`
        WHERE SupplierServiceID= ` +
			context.id;
	}

	//    console.log(query)
	const result = await database.simpleExecute(query);
	return result;
}

module.exports.updateStatus = updateStatus;*/
