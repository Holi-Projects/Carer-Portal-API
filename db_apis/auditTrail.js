const database = require('../services/database.js');
const { mapDataForSelect } = require('../utils/mapUtils');
const { mapDataForInsert } = require('../utils/mapUtils');

const dataFields = {
	id           : '[SeqNo]',
	companyId    : '[CompanyId]',
	clientId     : '[Client ID]',
	clientName   : '[Client Name]',
	agencyId     : '[Agency ID]',
	agencyName   : '[Agency Name]',
	carerId      : '[Carer ID]',
	carerName    : '[Carer Name]',
	employeeId   : '[Employee ID]',
	employeeName : '[Employee Name]',
	action       : '[Action]',
	actionSource : '[ActionSource]',
};
const primaryKey = dataFields.id;

const dateTimeFields = {
	date : '[AuditDate]',
};

const timeFields = {};

const dbFields = {
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

function parseFilterCondition([ field, operator, value ]) {
	// translate to DB field name
	let s = dataFields[field];
	if (field === 'date') s = dateTimeFields[field];

	if (operator === 'contains') s += ` LIKE '%${value}%' `;
	if (operator === 'notcontains') s += ` NOT LIKE '%${value}%' `;
	if (operator === 'startswith') s += ` LIKE '${value}%' `;
	if (operator === 'endswith') s += ` LIKE '%${value}' `;

	if (typeof value === 'string') value = `'${value}'`; // strings need to single quoted in SQL
	if (typeof value === 'boolean') value = value ? 1 : 0; // booleans need to be translated from true/false to 1/0 in SQL

	if (operator === '=') s += ` = ${value} `;
	if (operator === '<>') s += ` <> ${value} `;
	if (operator === '<') s += ` < ${value} `;
	if (operator === '>') s += ` > ${value} `;
	if (operator === '<=') s += ` <= ${value} `;
	if (operator === '>=') s += ` >= ${value} `;

	return s;
}

function parseFilter(filter) {
	let s = '(';
	if (typeof filter[0] === 'string') {
		// single condition
		s += parseFilterCondition(filter);
	} else {
		filter.map((element) => {
			s += typeof element === 'string' ? `${element} ` : parseFilter(element); // recursive !
		});
	}
	s += ')';

	return s;
}

async function getList(user, queryParams) {
	console.log('DB:auditTrail.getList(user, queryParams)');

	// Fields to select
	const fieldList = mapDataForSelect('A', dbFields, dataFields.id, user.companyTimezone);
	let query = `SELECT ${fieldList} FROM [vwAuditTrailDetails] A `;

	// Build where clause
	let where = `WHERE A.[CompanyId] = ${user.companyId} `;
	//let where = `WHERE A.[SeqNo] IS NOT NULL `; // temp where clause untill CompanyID gets added to view

	if (queryParams.filter) {
		const filter = JSON.parse(queryParams.filter);
		where += `AND  ${parseFilter(filter)} `;
		console.log(where);
	}

	query += where;

	// build order by clause
	if (queryParams.sort) {
		const sort = JSON.parse(queryParams.sort);
		const selectors = sort.map(({ selector, desc }) => selector + (desc ? ' DESC' : ''));
		query += 'ORDER BY ' + selectors.join() + ' ';
		//console.log(query);
	} else {
		// Must order by something for FETCH NEXT to be happy
		query += 'ORDER BY A.[AuditDate] DESC ';
	}

	// Get only selected page of records
	query += 'OFFSET ' + queryParams.skip + ' ROWS FETCH NEXT ' + queryParams.take + ' ROWS ONLY';
	console.log(query);

	const result = {};

	const queryResult = await database.simpleExecute(query);
	result.data = queryResult.recordset;

	// Add total count of records
	if (queryParams.requireTotalCount && queryParams.requireTotalCount === 'true') {
		let query = 'SELECT COUNT(*) AS totalCount FROM [vwAuditTrailDetails] A ' + where;
		const queryResult2 = await database.simpleExecute(query);
		console.log('TotalCount: ' + queryResult2.recordset[0].totalCount);
		result.totalCount = queryResult2.recordset[0].totalCount;
	}

	return result;
}
module.exports.getList = getList;

async function insert(user, data) {
	console.log('DB:auditTrail.insert(user, data)');
	let [ fieldList, valueList ] = mapDataForInsert(data, dbFields, primaryKey, user.companyTimezone);
	//console.log(fields)
	const stmt = `INSERT INTO [Audit Trail] (${fieldList}) OUTPUT INSERTED.${primaryKey} AS id VALUES (${valueList});`;

	console.log(stmt);
	result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}
module.exports.insert = insert;
