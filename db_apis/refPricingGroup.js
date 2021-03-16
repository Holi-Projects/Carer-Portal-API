const database = require('../services/database.js');
const { listSqlStatement } = require('../utils/mapUtils');
const { dbModel } = require('../db_model/refPricingGroup.js');

// Get PricingGroup reference data on a GET HTTP request
async function getRefPricingGroup(user) {
	console.log('Run: function getRefPricingGroup(user) ');

	let query =
		'SELECT PricingGroupNo AS id, PricingGroupName AS name, PricingGroupSuffix AS suffix ' +
		'FROM [Ref Pricing Groups] ' +
		'WHERE PricingGroupName IS NOT NULL ' +
		`AND CompanyID = ${user.companyId} ` +
		'ORDER BY PricingGroupName';
	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.getRefPricingGroup = getRefPricingGroup;

async function list(user) {
	console.log('DB:refPricingGroup.list(user) ');

	let query = listSqlStatement(user, dbModel);
	query += 'AND PricingGroupName IS NOT NULL ORDER BY [PricingGroupName]';

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.list = list;
