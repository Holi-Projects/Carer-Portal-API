const database = require('../services/database.js');
const { mapDataForInsert } = require('../utils/mapUtils');
//const { mapDataForSelect } = require('../utils/mapUtils');
const { mapDataForUpdate } = require('../utils/mapUtils');
const dateTimeUtil = require('../utils/dateTimeUtil');
const refPostCode = require('./refPostCode.js');

const dataFields = {
	id            : '[ID]',
	companyId     : '[CompanyID]',
	firstName     : '[First Name]',
	lastName      : '[Last Name]',
	address       : '[Address]',
	locality      : '[City]',
	state         : '[State/Province]',
	postcode      : '[ZIP/Postal Code]',
	country       : '[Country/Region]',
	businessPhone : '[Business Phone]',
	homePhone     : '[Home Phone]',
	mobile        : '[Mobile Phone]',
	fax           : '[Fax Number]',
	email         : '[E-mail Address]',
	jobTitle      : '[Job Title]',
	notes         : '[Notes]',
	company       : '[Company]',
	ABN           : '[ABN]',
	taxFileNo     : '[Tax File No]',
	webPage       : '[Web Page]',
	photoFileName : '[Photo File Name]',
	userId        : '[UserID]',
};
const primaryKey = dataFields.id;

const dateTimeFields = {
	startDate       : '[Start Date]',
	terminationDate : '[Termination Date]',
};

const timeFields = {};

const dbFields = {
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

// Get high level employee information
async function list(user, queryParams) {
	console.log('DB:employee.getList(user, queryParams)');
	//console.log(`employeeId: ${user.employeeId}`);
	console.log(queryParams);

	let query = `SELECT
			E.[ID] AS id,
			E.[First Name] AS firstName,
			E.[Last Name] AS lastName,
			E.[First Name] + ' ' +  E.[Last Name] AS name,
			E.[Last Name] + ', ' +  E.[First Name] AS name2,
			E.[Address] AS address,
			E.[City] AS locality,
			E.[State/Province] AS state,
			E.[ZIP/Postal Code] AS postcode,
			P.[ID] AS localityId,
			E.[Country/Region] AS country,
			E.[Business Phone] AS businessPhone,
			E.[Home Phone] AS homePhone,
			E.[Mobile Phone] AS mobile,
			E.[Fax Number] AS fax,
			E.[E-mail Address] AS email,
			E.[Job Title] AS jobTitle,
			E.[Notes] AS notes,
			${dateTimeUtil.dbDate2utcDate('E.[Start Date]', user.companyTimezone)} AS startDate,
			${dateTimeUtil.dbDate2utcDate('E.[Termination Date]', user.companyTimezone)} AS terminationDate,
			E.[Company] AS company,
			E.[ABN] AS ABN,
			E.[Tax File No] as taxFileNo,
			E.[Web Page] AS webPage,
			E.[Photo File Name] AS photoFileName,
			E.[UserID] AS userId
		FROM Employees E
		LEFT JOIN [Post Codes AU] P ON E.[City] = P.[Locality] AND E.[State/Province] = P.[State] AND E.[ZIP/Postal Code] = P.[Pcode]
 		WHERE E.[CompanyID] = ${user.companyId} `;

	if (queryParams.activeOnly != undefined)
		query += 'AND ([Termination Date] IS NULL OR [Termination Date] > GETDATE()) ';

	query += 'ORDER BY E.[First Name], E.[Last Name]';

	console.log(query);

	const result = {};

	const queryResult = await database.simpleExecute(query);
	result.data = queryResult.recordset;
	return result;
}
module.exports.list = list;

// Get empoyee detail information
async function get(user, id) {
	console.log('DB:employee.get(user, id)');
	console.log(`id: ${id}`);

	let query = `SELECT
			E.[ID] AS id,
			E.[First Name] AS firstName,
			E.[Last Name] AS lastName,
			E.[First Name] + ' ' +  E.[Last Name] AS name,
			E.[Last Name] + ', ' +  E.[First Name] AS name2,
			E.[Address] AS address,
			E.[City] AS locality,
			E.[State/Province] AS state,
			E.[ZIP/Postal Code] AS postcode,
			P.[ID] AS localityId,
			E.[Country/Region] AS country,
			E.[Business Phone] AS businessPhone,
			E.[Home Phone] AS homePhone,
			E.[Mobile Phone] AS mobile,
			E.[Fax Number] AS fax,
			E.[E-mail Address] AS email,
			E.[Job Title] AS jobTitle,
			E.[Notes] AS notes,
			${dateTimeUtil.dbDate2utcDate('E.[Start Date]', user.companyTimezone)} AS startDate,
			${dateTimeUtil.dbDate2utcDate('E.[Termination Date]', user.companyTimezone)} AS terminationDate,
			E.[Company] AS company,
			E.[ABN] AS ABN,
			E.[Tax File No] as taxFileNo,
			E.[Web Page] AS webPage,
			E.[Photo File Name] AS photoFileName,
			E.[UserID] AS userId
		FROM Employees E
		LEFT JOIN [Post Codes AU] P ON E.[City] = P.[Locality] AND E.[State/Province] = P.[State] AND E.[ZIP/Postal Code] = P.[Pcode]
		WHERE E.[ID] = ${id} AND E.[CompanyId] = ${user.companyId}`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.get = get;

// Update employee detail information
async function update(user, id, employee) {
	console.log('DB:employee.update(user, id, employee)');

	if (employee.localityId) {
		const rows = await refPostCode.getRefPostCode(user, employee.localityId);
		if (rows.length === 1) {
			employee.locality = rows[0].localityLower;
			employee.state = rows[0].state;
			employee.postcode = rows[0].postcode;
		}
	}

	/*let fields = [];
	for (let [ key, value ] of Object.entries(employee)) {
		console.log(key, value);

		const dbFieldName = dbField[key];
		if (value && dbFieldName && dbFieldName !== '[ID]') {
			if (typeof value === 'string') value = `'${value}'`; // strings need to single quoted in SQL
			if (typeof value === 'boolean') value = value ? 1 : 0; // booleans need to be translated from true/false to 1/0 in SQL
			if (dateFields.includes(dbFieldName)) value = dateTimeUtil.utcDate2dbDate(value, user.companyTimezone);

			fields.push(`${dbFieldName}=${value}`);
		}
	}
	const fieldList = fields.join();*/

	const keyValueList = mapDataForUpdate(employee, dbFields, primaryKey, user.companyTimezone);
	const stmt = `UPDATE [Employees] SET ${keyValueList} WHERE ${primaryKey}=${id} AND [CompanyID] = ${user.companyId}`;

	console.log(stmt);
	const result = await database.simpleExecute(stmt);
	//console.log(result);
	return result;
}
module.exports.update = update;

async function insert(user, employee) {
	console.log('DB:employee.insert(user, employee)');

	const res = { success: false };

	// Check mandatory fields
	if (employee.firstName === undefined) {
		res.message = 'First Name is mandatory';
		return res;
	}
	if (employee.lastName === undefined) {
		res.message = 'Last Name is mandatory';
		return res;
	}
	if (employee.email === undefined) {
		res.message = 'Email is mandatory';
		return res;
	}
	if (employee.userId === undefined) {
		res.message = 'User ID is mandatory';
		return res;
	}

	// Duplicate Detection
	let query = `SELECT 
					[ID] AS id 
				FROM [Employees] 
				WHERE [CompanyID] = ${user.companyId}
				  AND [First Name] = '${employee.firstName}' 
				  AND [Last Name] = '${employee.lastName}'`;

	console.log(query);
	let result = await database.simpleExecute(query);
	if (result.recordset.length > 0) {
		res.message = 'Duplicate detected (First Name and Last Name)';
		res.id = result.recordset[0].id;
		return res;
	}

	query = `SELECT 
					[ID] AS id 
				FROM [Employees] 
				WHERE [CompanyID] = ${user.companyId}
				  AND [E-mail Address] = '${employee.email}'`;

	console.log(query);
	result = await database.simpleExecute(query);
	if (result.recordset.length > 0) {
		res.message = 'Duplicate detected (Email)';
		res.id = result.recordset[0].id;
		return res;
	}

	query = `SELECT 
					[ID] AS id 
				FROM [Employees] 
				WHERE [CompanyID] = ${user.companyId}
				  AND [UserID] = '${employee.userId}'`;

	console.log(query);
	result = await database.simpleExecute(query);
	if (result.recordset.length > 0) {
		res.message = 'Duplicate detected (User ID)';
		res.id = result.recordset[0].id;
		return res;
	}

	let fields = [ '[CompanyID]' ];
	let values = [ user.companyId ];

	if (employee.localityId) {
		const rows = await refPostCode.getRefPostCode(user, employee.localityId);
		if (rows.length === 1) {
			employee.locality = rows[0].localityLower;
			employee.state = rows[0].state;
			employee.postcode = rows[0].postcode;
		}
	}

	/*for (let [ key, value ] of Object.entries(employee)) {
		console.log(key, value);

		const dbFieldName = dbField[key];
		if (value && dbFieldName && dbFieldName !== '[ID]') {
			if (typeof value === 'string') value = `'${value}'`; // strings need to single quoted in SQL
			if (typeof value === 'boolean') value = value ? 1 : 0; // booleans need to be translated from true/false to 1/0 in SQL
			if (dateFields.includes(dbFieldName)) value = dateTimeUtil.utcDate2dbDate(value, user.companyTimezone);

			fields.push(dbFieldName);
			values.push(value);
		}
	}
	const fieldList = fields.join();
	const valueList = values.join();*/

	const [ fieldList, valueList ] = mapDataForInsert(employee, dbFields, primaryKey, user.companyTimezone);
	const stmt = `INSERT INTO [Employees] (${fieldList}) OUTPUT INSERTED.${primaryKey} AS id VALUES (${valueList});`;

	console.log(stmt);
	result = await database.simpleExecute(stmt);
	console.log(result);

	if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
		res.success = true;
		res.message = 'Employee inserted successfully';
		res.id = result.recordset[0].id;
		return res;
	}

	res.message = 'Insert failed';
	return res;
}
module.exports.insert = insert;

async function remove(user, id) {
	console.log('DB:employee.remove(user, id)');

	let query = `DELETE FROM [Employees] 
        OUTPUT DELETED.${primaryKey} AS id 
		WHERE ${primaryKey} = ${id}
		AND [CompanyID] = ${user.companyId}`;

	console.log(query);
	const result = await database.simpleExecute(query);
	console.log(result);
	return result;
}
module.exports.remove = remove;
