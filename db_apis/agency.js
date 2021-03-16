const database = require('../services/database.js');
const dateTimeUtil = require('../utils/dateTimeUtil');
const refPostCode = require('./refPostCode.js');

const dbField = {
	id               : '[ID]',
	companyId        : '[CompanyID]',
	name             : '[Company]',
	contactFirstName : '[Contact First Name]',
	contactLastName  : '[Contact Last Name]',
	email            : '[E-mail Address]',
	contactJobTitle  : '[Job Title]',
	businessPhone    : '[Business Phone]',
	homePhone        : '[Home Phone]',
	mobile           : '[Mobile Phone]',
	fax              : '[Fax Number]',
	pager            : '[Pager Number 1]',
	pager2           : '[Pager Number 2]',
	address          : '[Address]',
	locality         : '[City]',
	state            : '[State/Province]',
	postcode         : '[ZIP/Postal Code]',
	country          : '[Country/Region]',
	webPage          : '[Web Page]',
	notes            : '[Notes]',
	attachments      : '[Attachments]',
	attachmentsPath  : '[AttachmentsPath]',
	category         : '[Category]',
	lastInvoicedDate : '[Date Last Invoiced]',
	chargeGST        : '[Charge GST]',
	orderReference   : '[Order Reference]',
	cardId           : '[Card ID]',
	abbreviation     : '[Agency Abbrev]',
	invoiceByClient  : '[Invoice By Client]',
	pricingGroupId   : '[PricingGroupNo]',
};

const dateFields = [ '[Date Last Invoiced]' ];

// Get high level agency information
async function getList(user, queryParams) {
	console.log('DB:agency.getList(user, queryParams)');
	//console.log(queryParams);

	let query = `SELECT
			A.[ID] AS id,
			A.[Company] AS name,
			A.[Address] AS address,
			A.[City] AS locality,
			A.[State/Province] AS state,
			A.[ZIP/Postal Code] AS postcode,
			A.[City] + ' ' + A.[State/Province] + ' ' + A.[ZIP/Postal Code] AS locality2,
			A.[Business Phone] AS businessPhone,
			A.[Mobile Phone] AS mobile,
			A.[Card ID] AS cardId,
			A.[PricingGroupNo] as pricingGroupId,
			P.[PricingGroupName] AS pricingGroupName
		FROM Agencies A 
		LEFT JOIN [Ref Pricing Groups] P ON A.[PricingGroupNo] = P.[PricingGroupNo] `;

	let where = `WHERE A.[CompanyID] = ${user.companyId} `;

	//if (queryParams.activeOnly) {
	//	where +=
	//		'AND  (A.[???? Date] IS NULL OR (A.[????? Date] > GETDATE())) ';
	//}
	query += where;

	query += 'ORDER BY [Company]';

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getList = getList;

// Get agency detail information
async function get(user, agencyId) {
	console.log('DB:agency.get(user, agencyId)');

	let query = `SELECT
			A.[ID] AS id,
			A.[Company] AS name,
			A.[Contact First Name] AS contactFirstName,
			A.[Contact Last Name] AS contactLastName,
			A.[Contact First Name] + ' ' + A.[Contact Last Name] AS contactName,
			A.[E-mail Address] AS email,
			A.[Job Title] AS contactJobTitle,
			A.[Business Phone] AS businessPhone,
			A.[Home Phone] AS homePhone,
			A.[Mobile Phone] AS mobile,
			A.[Fax Number] AS fax,
			A.[Pager Number 1] AS pager,
			A.[Pager Number 2] AS pager2,
			A.[Address] AS address,
			A.[City] AS locality,
			A.[State/Province] AS state,
			A.[ZIP/Postal Code] AS postcode,
			--A.[City] + ' ' + A.[State/Province] + ' ' + A.[ZIP/Postal Code] AS locality2,
			Q.[ID] AS localityId,
			A.[Country/Region] AS country,
			A.[Web Page] AS webPage,
			A.[Notes] AS notes,
			A.[Attachments] AS attachments,
			A.[AttachmentsPath] AS attachmentsPath,
			A.[Category] AS category,
			${dateTimeUtil.dbDate2utcDate('A.[Date Last Invoiced]', user.companyTimezone)} AS lastInvoicedDate,
			A.[Charge GST] AS chargeGST,
			A.[Order Reference] AS orderReference,
			A.[Card ID] AS cardId,
			A.[Agency Abbrev] AS abbreviation,
			A.[Invoice By Client] AS invoiceByClient,
			A.[PricingGroupNo] AS pricingGroupId,
			P.[PricingGroupName] AS pricingGroupName,
			P.[PricingGroupSuffix] AS pricingGroupSuffix
		FROM Agencies A
		LEFT JOIN [Ref Pricing Groups] P ON A.[PricingGroupNo] = P.[PricingGroupNo]
		LEFT JOIN [Post Codes AU] Q ON A.[City] = Q.[Locality] AND A.[State/Province] = Q.[State] AND A.[Zip/Postal Code] = Q.[PCode] 
		WHERE A.[ID] = ${agencyId} AND A.[CompanyId] = ${user.companyId}`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.get = get;

// Update agency detail information
async function update(user, id, agency) {
	console.log('DB:agency.update(user, id, agency)');

	if (agency.localityId) {
		const rows = await refPostCode.getRefPostCode(user, agency.localityId);
		if (rows.length === 1) {
			agency.locality = rows[0].localityLower;
			agency.state = rows[0].state;
			agency.postcode = rows[0].postcode;
		}
	}

	let fields = [];
	for (let [ key, value ] of Object.entries(agency)) {
		console.log(key, value);

		const dbFieldName = dbField[key];
		if (value && dbFieldName && dbFieldName !== '[ID]') {
			if (typeof value === 'string') value = `'${value}'`; // strings need to single quoted in SQL
			if (typeof value === 'boolean') value = value ? 1 : 0; // booleans need to be translated from true/false to 1/0 in SQL
			if (dateFields.includes(dbFieldName)) value = dateTimeUtil.utcDate2dbDate(value, user.companyTimezone);

			fields.push(`${dbFieldName}=${value}`);
		}
	}
	const fieldList = fields.join();

	const stmt = `UPDATE [Agencies] SET ${fieldList} WHERE [ID]=${id} AND [CompanyID] = ${user.companyId}`;

	console.log(stmt);
	const result = await database.simpleExecute(stmt);
	//console.log(result);
	return result;
}
module.exports.update = update;

async function insert(user, agency) {
	console.log('DB:agency.insert(user, agency)');

	const res = { success: false };

	// Check mandatory fields
	if (agency.name === undefined) {
		res.message = 'Company Name is mandatory';
		return res;
	}

	// Duplicate Detection
	let query = `SELECT 
					[ID] AS id 
				FROM [Agencies] 
				WHERE [CompanyID] = ${user.companyId}
				  AND [Company] = '${agency.name}'`;

	console.log(query);
	let result = await database.simpleExecute(query);
	if (result.recordset.length > 0) {
		res.message = 'Duplicate detected';
		res.id = result.recordset[0].id;
		return res;
	}

	let fields = [ '[CompanyID]' ];
	let values = [ user.companyId ];

	if (agency.localityId) {
		const rows = await refPostCode.getRefPostCode(user, agency.localityId);
		if (rows.length === 1) {
			agency.locality = rows[0].localityLower;
			agency.state = rows[0].state;
			agency.postcode = rows[0].postcode;
		}
	}

	for (let [ key, value ] of Object.entries(agency)) {
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
	const valueList = values.join();

	const stmt = `INSERT INTO [Agencies] (${fieldList}) OUTPUT INSERTED.ID AS id VALUES (${valueList});`;

	console.log(stmt);
	result = await database.simpleExecute(stmt);
	console.log(result);

	if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
		res.success = true;
		res.message = 'Agency inserted successfully';
		res.id = result.recordset[0].id;
		return res;
	}

	res.message = 'Insert failed';
	return res;
}
module.exports.insert = insert;

async function remove(user, id) {
	console.log('DB:agency.remove(user, id)');

	let query = `DELETE FROM [Agencies] 
        OUTPUT DELETED.[ID] AS id 
		WHERE [ID] = ${id}
		AND [CompanyID] = ${user.companyId}`;

	console.log(query);
	const result = await database.simpleExecute(query);
	console.log(result);
	return result;
}
module.exports.remove = remove;
