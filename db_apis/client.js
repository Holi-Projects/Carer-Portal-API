const database = require('../services/database.js');
const dateTimeUtil = require('../utils/dateTimeUtil');
const refPostCode = require('./refPostCode.js');

const dbField = {
	id                     : '[ID]',
	companyId              : '[CompanyID]',
	firstName              : '[First Name]',
	lastName               : '[Last Name]',
	address                : '[Address]',
	locality               : '[City]',
	state                  : '[State/Province]',
	postcode               : '[ZIP/Postal Code]',
	country                : '[Country/Region]',
	homePhone              : '[Home Phone]',
	businessPhone          : '[Business Phone]',
	mobile                 : '[Mobile Phone]',
	fax                    : '[Fax Number]',
	email                  : '[E-mail Address]',
	preferredContactMethod : '[Preferred Contact Method]',
	dateOfBirth            : '[Date of Birth]',
	gender                 : '[Gender]',
	primaryLanguageId      : '[PrimaryLanguage]',
	ethnicityId            : '[Ethnicity]',
	deceased               : '[Deceased]',
	medicalNotes           : '[Medical Notes]',
	treatmentNotes         : '[Treatment Notes]',
	generalNotes           : '[General Notes]',
	serviceStartDate       : '[Service Start Date]',
	serviceFinishDate      : '[Service Finish Date]',
	serviceComments        : '[Service Comments]',
	notRequiredFromDate    : '[Not Required From Date]',
	notRequiredToDate      : '[Not Required To Date]',
	notRequiredComments    : '[Not Required Comments]',
	doctorsName            : '[Doctors Name]',
	doctorsPhone           : '[Doctors Phone]',
	doctorsMobile          : '[Doctors Mobile]',
	doctorsEmail           : '[Doctors Email]',
	doctorsAddress         : '[Doctors Address]',
	emergencyName          : '[Emergency Name]',
	emergencyPhone         : '[Emergency Phone]',
	emergencyMobile        : '[Emergency Mobile]',
	emergencyEmail         : '[Emergency Email]',
	emergencyAddress       : '[Emergency Address]',
	emergency2Name         : '[Emergency2 Name]',
	emergency2Phone        : '[Emergency2 Phone]',
	emergency2Mobile       : '[Emergency2 Mobile]',
	emergency2Email        : '[Emergency2 Email]',
	emergency2Address      : '[Emergency2 Address]',
	privateClient          : '[Private Client]',
	ndisClient             : '[NDIS Client]',
	jobReference           : '[Job Ref]',
	invoiceClientId        : '[Invoice To Client ID]',
	invoiceAgencyId        : '[Invoice To Agency ID]',
	invoiceReference       : '[Invoice Reference]',
	clientManagerId        : '[Employee Manager ID]',
	attachmentsPatn        : '[AttachmentsPath]',
	cardId                 : '[Card ID]',
	clientCategoryId       : '[ClientCategoryNo]',
	pricingGroupId         : '[PricingGroupNo]',
};

const dateFields = [
	'[Date of Birth]',
	'[Service Start Date]',
	'[Service Finish Date]',
	'[Not Required From Date]',
	'[Not Required To Date]',
];

function parseFilterCondition([ field, operator, value ]) {
	// translate to DB field name
	let s = dbField[field];

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

async function getClients(user, queryParams) {
	console.log('Run: function getClients(user, queryParams)');
	//console.log(`employeeId: ${user.employeeId}`);
	console.log(queryParams);

	// Fields to select
	let query = `SELECT
			[ID] AS id,
			[First Name] AS firstName,
			[Last Name] AS lastName,
			[First Name] + ' ' +  [Last Name] AS name,
			[Last Name] + ', ' +  [First Name] AS name2,
			--[Date of Birth] AS dateOfBirth,
			${dateTimeUtil.dbDate2utcDate('[Date of Birth]', user.companyTimezone)} AS dateOfBirth,
			[Gender] AS gender,
			[Deceased] AS deceased,
			[Address] AS address,
			[City] AS locality,
			[State/Province] AS state,
			[ZIP/Postal Code] AS postcode,
			--P.[ID] AS localityId,
			[City] + ' ' + [State/Province] + ' ' + [ZIP/Postal Code] AS locality2,
			--[Service Start Date] AS serviceStartDate,
			${dateTimeUtil.dbDate2utcDate('[Service Start Date]', user.companyTimezone)} AS serviceStartDate,
			--[Service Finish Date] AS serviceFinishDate
			${dateTimeUtil.dbDate2utcDate('[Service Finish Date]', user.companyTimezone)} AS serviceFinishDate
		FROM Clients C `;
	//LEFT JOIN [Post Codes AU] P ON [City] = P.[Locality] AND [State/Province] = P.[State] AND [ZIP/Postal Code] = P.[Pcode] `;

	// Build WHERE clause
	let where = `WHERE C.[CompanyID] = ${user.companyId} `;

	if (queryParams.filter) {
		const filter = JSON.parse(queryParams.filter);
		where += `AND  ${parseFilter(filter)} `;
		console.log(where);
	}

	if (queryParams.activeOnly != undefined) {
		where += 'AND ([Service Finish Date] IS NULL OR [Service Finish Date] > GETDATE()) AND [Deceased] = 0 ';
	}

	query += where;
	//console.log(query);

	if (queryParams.sort) {
		const sort = JSON.parse(queryParams.sort);
		const selectors = sort.map(({ selector, desc }) => selector + (desc ? ' DESC' : ''));
		query += 'ORDER BY ' + selectors.join() + ' ';
		//console.log(query);
	} else {
		// Must order by something for FETCH NEXT to be happy
		query2 = `SELECT RTRIM([Sort Clients]) AS sortClients FROM [System Parameters] WHERE [CompanyID] = ${user.companyId}`;
		const queryResult2 = await database.simpleExecute(query2);
		console.log('sortClients: ' + queryResult2.recordset[0].sortClients);
		if (queryResult2.recordset[0].sortClients === 'First Name') query += 'ORDER BY [First Name] ';
		else query += 'ORDER BY [Last Name] ';
	}

	query += 'OFFSET ' + queryParams.skip + ' ROWS FETCH NEXT ' + queryParams.take + ' ROWS ONLY';
	console.log(query);

	const result = {};

	const queryResult = await database.simpleExecute(query);
	result.data = queryResult.recordset;

	if (queryParams.requireTotalCount && queryParams.requireTotalCount === 'true') {
		let query = 'SELECT COUNT(*) AS totalCount FROM CLIENTS C ' + where;
		const queryResult2 = await database.simpleExecute(query);
		console.log('TotalCount: ' + queryResult2.recordset[0].totalCount);
		result.totalCount = queryResult2.recordset[0].totalCount;
	}

	return result;
}
module.exports.getClients = getClients;

// Get client detail information
async function getClient(user, clientId) {
	console.log('Run: function getClient(user, clientId)');

	let query = `SELECT
			C.[ID] AS id,
			C.[First Name] AS firstName,
			C.[Last Name] AS lastName,
			C.[First Name] + ' ' +  C.[Last Name] AS name,
			C.[Address] AS address,
			C.[City] AS locality,
			--C.[City]+' '+C.[State/Province]+' '+C.[Zip/Postal Code] AS locality,
			Q.[ID] AS localityId,
			C.[State/Province] AS state,
			C.[Zip/Postal Code] AS postcode,
			C.[Country/Region] AS country,
			C.[RegionRefNo] AS regionId, --?
			--R.[] AS region, --?
			C.[Home Phone] AS homePhone,
			C.[Business Phone] AS businessPhone,
			C.[Mobile Phone] AS mobile,
			C.[Fax Number] AS fax,
			C.[E-mail Address] AS email,
			C.[Preferred Contact Method] AS preferredContactMethod,
			--C.[Date of Birth] AS dateOfBirth,
			${dateTimeUtil.dbDate2utcDate('C.[Date of Birth]', user.companyTimezone)} AS dateOfBirth,
			C.[Gender] AS gender,
			C.[PrimaryLanguage] AS primaryLanguageId,
			L.[RefName] AS primaryLanguage,
			C.[Ethnicity] AS ethnicityId,
			E.[RefName] AS ethnicity,
			C.[Deceased] AS deceased, -- !! needs to be displayed in on General tab so it can be managed.
			C.[Medical Notes] AS medicalNotes,
			C.[Treatment Notes] AS treatmentNotes,
			C.[General Notes] AS generalNotes,
			--C.[Service Start Date] AS serviceStartDate,
			${dateTimeUtil.dbDate2utcDate('C.[Service Start Date]', user.companyTimezone)} AS serviceStartDate,
			--C.[Service Finish Date] AS serviceFinishDate,
			${dateTimeUtil.dbDate2utcDate('C.[Service Finish Date]', user.companyTimezone)} AS serviceFinishDate,
			C.[Service Comments] AS serviceComments,
			--C.[Not Required From Date] AS notRequiredFromDate,
			--${dateTimeUtil.dbDate2utcDate('C.[Not Required From Date]', user.companyTimezone)} AS notRequiredFromDate,
			--C.[Not Required To Date] AS notRequiredToDate,
			--${dateTimeUtil.dbDate2utcDate('C.[Not Required To Date]', user.companyTimezone)} AS notRequiredToDate,
			--C.[Not Required Comments] AS notRequiredComments,
			C.[Doctors Name] AS doctorsName,
			C.[Doctors Phone] AS doctorsPhone,
			C.[Doctors Mobile] AS doctorsMobile,
			C.[Doctors Email] AS doctorsEmail,
			C.[Doctors Address] AS doctorsAddress,
			C.[Emergency Name] AS emergencyName,
			C.[Emergency Phone] AS emergecyPhone,
			C.[Emergency Mobile] AS emergencyMobile,
			C.[Emergency Email] AS emergencyEmail,
			C.[Emergency Address] AS emergencyAddress,
			C.[Emergency2 Name] AS emergency2Name,
			C.[Emergency2 Phone] AS emergency2Phone,
			C.[Emergency2 Mobile] AS emergency2Mobile,
			C.[Emergency2 Email] AS emergency2Email,
			C.[Emergency2 Address] AS emergency2Address,
			--C.[Job Title] AS jobTitle,
			--C.[Company] AS company,
			--C.[ABN] AS ABN,
			--C.[Web Page] AS webPage,
			--C.[Category] AS categoryId,
			--C.[Employee ID] as employeeId,
			C.[Private Client] AS privateClient,
			C.[NDIS Client] AS ndisClient,
			C.[Job Ref] AS jobReference,
			C.[Invoice To Client ID] AS invoiceClientId,
			I.[First Name] AS invoiceClientFirstName,
			I.[Last Name] AS invoiceClientLastName,
			I.[First Name] + ' ' +  I.[Last Name] AS invoiceClientName,
			C.[Invoice To Agency ID] AS invoiceToAgencyId,
			--IA.[Company] AS invoiceAgency,
			C.[Invoice Reference] AS invoiceReference,
			C.[Employee Manager ID] AS clientManagerId,
			M.[First Name] + ' ' + M.[Last Name] AS clientManager,
			C.[Agency Contact ID] AS agencyContactId,
			--C.[Agency Manager Name] AS agencyManager, -- may need to get this from [Agencies Contacts] instead.
			--[Agency Manager Phone]
			--[Agency Manager Mobile]
			--[Agency Manager Email]
			--[Date Last Invoiced]
			--[Charge GST]
			--[Std Charge Per Hour]
			--[Photo File Name]
			C.[AttachmentsPath] AS attachmentsPath,
			C.[Card ID] AS cardId,
			C.[ClientCategoryNo] AS clientCategoryId,
			G.[ClientCategoryName] AS category,
			--MedicationSupportType
			--MedicationSupportSystem
			--MedicationStorage
			--MedicationLockBoxCode
			--MedicationComments,
			--DangerousDrugReactions,
			--DateLastHomeMedReview,
			--DateNewMedCartReqd,
			--PharmacyName,
			--PharmacyAddress,
			--PharmacyPhone,
			--PharmacyFax,
			--PharmacyEmail,		
			C.[PricingGroupNo] AS pricingGroupId,
			P.[PricingGroupName] AS pricingGroupName,
			P.[PricingGroupSuffix] AS pricingGroupSuffix
			--C.[Treatment Notes Archive] AS treatmentNotesArchive
		FROM Clients C
		LEFT JOIN [Ref Types] L ON C.[PrimaryLanguage] = L.[RefNo]
		LEFT JOIN [Ref Types] E ON C.[Ethnicity] = E.[RefNo]
		LEFT JOIN [Ref Client Categories] G ON C.[Category] = G.[ClientCategoryNo]
		LEFT JOIN Clients I ON C.[Invoice To Client ID] = I.[ID]
		LEFT JOIN [Ref Pricing Groups] P ON C.[PricingGroupNo] = P.[PricingGroupNo]
		LEFT JOIN [Post Codes AU] Q ON C.[City] = Q.[Locality] AND Q.[State] = C.[State/Province] AND Q.[PCode] = C.[Zip/Postal Code]
		LEFT JOIN [Employees] M ON M.ID = C.[Employee Manager ID] AND M.[CompanyID] = ${user.companyId}
		WHERE C.[ID] = ${clientId} AND C.[CompanyID] = ${user.companyId}`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getClient = getClient;

// Update client detail information
async function updateClient(user, clientId, client) {
	console.log('Run: function updateClient(user, clientId, client)');

	if (client.localityId) {
		const rows = await refPostCode.getRefPostCode(user, client.localityId);
		if (rows.length === 1) {
			client.locality = rows[0].localityLower;
			client.state = rows[0].state;
			client.postcode = rows[0].postcode;
		}
	}

	let fields = [];
	for (let [ key, value ] of Object.entries(client)) {
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

	const stmt = `UPDATE CLIENTS SET ${fieldList} WHERE [ID]=${clientId} AND [CompanyID] = ${user.companyId}`;

	console.log(stmt);
	const result = await database.simpleExecute(stmt);
	//console.log(result);
	return result;
}
module.exports.updateClient = updateClient;

// Add client
async function addClient(user, client) {
	console.log('Run: function addClient(user, client)');

	const res = { success: false };

	// Check mandatory fields
	if (client.firstName === undefined) {
		res.message = 'First Name is mandatory';
		return res;
	}
	if (client.lastName === undefined) {
		res.message = 'Last Name is mandatory';
		return res;
	}
	// XXXX DOB does not need to be mandatory, but if left NULL the duplicate detection should
	// regard two records with the same first and and last name different if the DOB is different (including NULL)
	if (client.dateOfBirth === undefined) {
		res.message = 'Date of Birth is mandatory';
		return res;
	}

	// Duplicate Detection
	const query = `SELECT 
					[ID] AS id 
				FROM CLIENTS 
				WHERE [CompanyID] = ${user.companyId}
				  AND [First Name] = '${client.firstName}' 
				  AND [Last Name] = '${client.lastName}' 
				  AND ${dateTimeUtil.dbDate2utcDate('[Date of Birth]', user.companyTimezone)} = '${client.dateOfBirth}'`;

	console.log(query);
	let result = await database.simpleExecute(query);
	if (result.recordset.length > 0) {
		res.message = 'Duplicate detected';
		res.id = result.recordset[0].id;
		return res;
	}

	let fields = [ '[CompanyID]' ];
	let values = [ user.companyId ];

	if (client.localityId) {
		const rows = await refPostCode.getRefPostCode(user, client.localityId);
		if (rows.length === 1) {
			client.locality = rows[0].localityLower;
			client.state = rows[0].state;
			client.postcode = rows[0].postcode;
		}
	}

	for (let [ key, value ] of Object.entries(client)) {
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

	const stmt = `INSERT INTO CLIENTS (${fieldList}) OUTPUT INSERTED.ID AS id VALUES (${valueList});`;

	console.log(stmt);
	result = await database.simpleExecute(stmt);
	console.log(result);

	if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
		res.success = true;
		res.message = 'Client inserted successfully';
		res.id = result.recordset[0].id;
		return res;
	}

	res.message = 'Insert failed';
	return res;
}
module.exports.addClient = addClient;

async function getClientBirthdays(user, queryParams) {
	console.log('Run: function getClientBirthdays(user, queryParams)');
	console.log(queryParams);

	// Fields to select
	let query = `SELECT
			C.[ID] AS id,
			C.[First Name] AS firstName,
			C.[Last Name] AS lastName,
			C.[First Name] + ' ' +  C.[Last Name] AS name,
			C.[Last Name] + ', ' +  C.[First Name] AS name2,
			${dateTimeUtil.dbDate2utcDate('C.[Date of Birth]', user.companyTimezone)} AS dateOfBirth,
			STR(MONTH([Date of Birth])) + ' ' + DATENAME(MONTH, [Date of Birth]) AS month,
			${dateTimeUtil.dbDate2utcDate(
				'DATEADD(YEAR, (YEAR(GETDATE()) - YEAR(C.[Date of Birth])), C.[Date of Birth])',
				user.companyTimezone
			)} AS birthDay,
			C.[Home Phone] AS homePhone,
			C.[Mobile Phone] AS	mobile,
			C.[E-mail Address] AS email
		FROM Clients C 
		WHERE C.[Date of Birth] IS NOT NULL AND C.[CompanyID] = ${user.companyId} 
		  AND ([Service Finish Date] IS NULL OR [Service Finish Date] > GETDATE()) AND [Deceased] = 0
		ORDER BY birthDay, name`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getClientBirthdays = getClientBirthdays;

async function getClientChargesAllocations(user, queryParams) {
	console.log('Run: function getClientChargesAllocations(user, queryParams)');
	console.log(queryParams);

	const startDate = `'${queryParams.startDate}'`;
	const endDate = `'${queryParams.endDate}'`;

	// Fields to select
	let query = `SELECT
			[ID] AS id,
			[Client Name] AS clientName,
			[Invoice Client] AS invoiceClient,
			[Booking Date] AS bookingDate,
			[Start Time] AS startTime,
			[End Time] AS endTime,
			[Carer] AS carerName,
			[Task Name] AS taskName,
			[Hours Charged] AS hoursCharged,
			[Shifts Charged] AS shiftsCharged,
			[KMs Charged] AS kmsCharged,
			--[24hr Shift] AS _24hrShift,
			--[Overnight Shift] AS overnightShift,
			--[Overnight Shift Active] AS overnightShiftActive,
			[ShiftTypeNo] AS shiftTypeId,
			[ShiftTypeName] AS shiftTypeName,
			[Charge Rate Qty] AS chargeRateQuantity,
			[Charge Per Shift] AS chargePerShift,
			[Charge Per KM] AS chargePerKm,
			[Total Charge] AS totalCharge,
			[Total GST] AS totalGst
			FROM [vwBookingsChargesDetails] `;

	let where = `WHERE [CompanyID] = ${user.companyId}
			  AND [Booking Date] >= ${dateTimeUtil.utcDate2dbDate(startDate, user.companyTimezone)}
			  AND [Booking Date] <= ${dateTimeUtil.utcDate2dbDate(endDate, user.companyTimezone)} `;

	if (queryParams.clientId != undefined) {
		where += `AND [Client ID] = ${queryParams.clientId} `;
	}

	query += where;

	query += 'ORDER BY [Client Name], [Booking Date]';

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getClientChargesAllocations = getClientChargesAllocations;

async function getClientChargesAllocationsSummary(user, queryParams) {
	console.log('Run: function getClientChargesAllocationsSummary(user, queryParams)');
	console.log(queryParams);

	const startDate = `'${queryParams.startDate}'`;
	const endDate = `'${queryParams.endDate}'`;

	let rows = [];

	const summaryFields = `SUM([Hours Charged]) AS hoursCharged,
							SUM([Shifts Charged]) AS shiftsCharged,
							SUM([KMs Charged]) AS kmsCharged,
							SUM([Total Charge]) AS totalCharge,
							SUM([Total GST]) AS totalGST `;

	// Get summaries for bookings invoiced to clients
	let query = `SELECT
			'Client: ' + [Invoice Client] AS invoiceTo, 
			${summaryFields}
			FROM [vwBookingsChargesDetails] 
			WHERE [CompanyID] = ${user.companyId}
			  AND [Booking Date] >= ${dateTimeUtil.utcDate2dbDate(startDate, user.companyTimezone)}
			  AND [Booking Date] <= ${dateTimeUtil.utcDate2dbDate(endDate, user.companyTimezone)} 
			  AND [Invoice To Client ID] IS NOT NULL
			GROUP BY [Invoice Client] 
			ORDER BY [Invoice Client]`;

	console.log(query);
	let result = await database.simpleExecute(query);
	console.log(result);
	rows = rows.concat(result.recordset);

	// Get summaries for bookings invoiced to agencies
	query = `SELECT
			'Agency: ' + [Agency Name] AS invoiceTo, 
			${summaryFields}
			FROM [vwBookingsChargesDetails] 
			WHERE [CompanyID] = ${user.companyId}
			  AND [Booking Date] >= ${dateTimeUtil.utcDate2dbDate(startDate, user.companyTimezone)}
			  AND [Booking Date] <= ${dateTimeUtil.utcDate2dbDate(endDate, user.companyTimezone)} 
			  AND [Invoice To Agency ID] IS NOT NULL
			GROUP BY [Agency Name] 
			ORDER BY [Agency Name]`;

	console.log(query);
	result = await database.simpleExecute(query);
	console.log(result);
	rows = rows.concat(result.recordset);

	// Get summaries for bookings not invoiced to clients or agencies
	query = `SELECT
			'Unknown' AS invoiceTo, 
			${summaryFields}
			FROM [vwBookingsChargesDetails] 
			WHERE [CompanyID] = ${user.companyId}
			  AND [Booking Date] >= ${dateTimeUtil.utcDate2dbDate(startDate, user.companyTimezone)}
			  AND [Booking Date] <= ${dateTimeUtil.utcDate2dbDate(endDate, user.companyTimezone)} 
			  AND [Invoice To Client ID] IS NULL
			  AND [Invoice To Agency ID] IS NULL`;

	console.log(query);
	result = await database.simpleExecute(query);
	console.log(result);
	rows = rows.concat(result.recordset);

	return rows;
}
module.exports.getClientChargesAllocationsSummary = getClientChargesAllocationsSummary;

// Get service start month
async function getServiceStartMonth(user, clientId) {
	console.log('Run: function getServiceStartMonth(user, clientId)');

	let query = `SELECT
			C.[ID] AS id,
			MONTH(C.[Service Start Date]) AS startMonth,
			YEAR(C.[Service Start Date]) AS startYear
		FROM Clients C
		WHERE C.[ID] = ${clientId} AND C.[CompanyID] = ${user.companyId}`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getServiceStartMonth = getServiceStartMonth;
