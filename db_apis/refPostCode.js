const database = require('../services/database.js');

const dbField = {
	id            : '[ID]',
	postcode      : '[Pcode]',
	locality      : '[Locality]',
	state         : '[State]',
	comment       : '[Comment]',
	localityLower : '[LocalityLower]',
	locality2     : '[Locality2]',
};

function parseSearchCondition(expr, operation, value) {
	// translate to DB field name
	let s = dbField[expr];
	//console.log(expr);

	if (operation === 'contains') s += ` LIKE '%${value}%' `;
	if (operation === 'startswith') s += ` LIKE '${value}%' `;

	return s;
}

// Get PostCode reference data on a GET HTTP request
async function getRefPostCodes(user, queryParams) {
	console.log('Run: function getRefPostCodes(user, queryParams) ');
	queryParams && console.log(queryParams);
	let query = `SELECT `;

	if (queryParams && queryParams.top) {
		const top = parseInt(queryParams.top);
		query += `TOP(${top}) `;
	} else {
		query += `TOP(50) `;
	}

	query += `[ID] AS id,
			[Pcode] AS postcode,
			[Locality] AS locality,
			[State] AS state,
			[Comment] AS comment,
			[LocalityLower] AS localityLower,
			[Locality2] AS locality2
		FROM [Post Codes AU] `;

	if (
		queryParams &&
		queryParams.searchExpr &&
		queryParams.searchOperation &&
		queryParams.searchValue &&
		queryParams.searchValue !== 'null' &&
		queryParams.searchValue !== 'undefined'
	) {
		//console.log(queryParams.searchExpr);
		//console.log(queryParams.searchOperation);
		//console.log(queryParams.searchValue);

		query += `WHERE ${parseSearchCondition(
			queryParams.searchExpr,
			queryParams.searchOperation,
			queryParams.searchValue
		)}`;
	}

	query += ' ORDER BY [Locality2]';
	console.log(query);

	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.getRefPostCodes = getRefPostCodes;

// Get PostCode reference data on a GET HTTP request
async function getRefLocalities(user, queryParams) {
	console.log('Run: function getRefPostCodes(user, queryParams) ');
	queryParams && console.log(queryParams);
	let query = `SELECT `;

	if (queryParams && queryParams.top) {
		const top = parseInt(queryParams.top);
		query += `TOP(${top}) `;
	} else {
		query += `TOP(50) `;
	}

	query += `[Locality2] AS locality2
		FROM [Post Codes AU] `;

	if (queryParams && queryParams.searchExpr && queryParams.searchOperation && queryParams.searchValue) {
		console.log(queryParams.searchExpr);
		console.log(queryParams.searchOperation);
		console.log(queryParams.searchValue);

		query += `WHERE ${parseSearchCondition(
			queryParams.searchExpr,
			queryParams.searchOperation,
			queryParams.searchValue
		)}`;
	}
	console.log(query);

	query += ' ORDER BY [Locality2]';

	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getRefLocalities = getRefLocalities;

// Get PostCode reference data on a GET HTTP request
async function getRefPostCode(user, id) {
	console.log('Run: function getRefPostCode(user, id) ');
	let query = `SELECT
			[ID] AS id,
			[Pcode] AS postcode,
			[Locality] AS locality,
			[State] AS state,
			[Comment] AS comment,
			[LocalityLower] AS localityLower,
			[Locality2] AS locality2
		FROM [Post Codes AU]
		WHERE [ID] = ${id}`;

	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getRefPostCode = getRefPostCode;
