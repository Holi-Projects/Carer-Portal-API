const database = require('../services/database.js');
const dateFns = require('date-fns');
const parseISO = require('date-fns/parseISO');
const dateTimeUtil = require('../utils/dateTimeUtil');
const { mapDataForSelect, mapDataForInsert, mapDataForUpdate } = require('../utils/mapUtils');
const { dbModel } = require('../db_model/carer.js');
const refPostCode = require('./refPostCode.js');

async function getCarers(user, queryParams) {
	console.log('Run: function getCarers(user, queryParams)');
	//console.log(`employeeId: ${user.employeeId}`);
	console.log(queryParams);

	// Fields to select
	let query = `SELECT
			C.[ID] AS id,
			C.[First Name] AS firstName,
			C.[Last Name] AS lastName,
			C.[First Name] + ' ' +  C.[Last Name] AS name,
			C.[Last Name] + ', ' +  C.[First Name] AS name2,
			C.[Address] AS address,
			C.[City] AS locality,
			C.[State/Province] AS state,
			C.[ZIP/Postal Code] AS postcode,
			C.[City]+' '+C.[State/Province]+' '+C.[Zip/Postal Code] AS locality2,
			--C.[Date of Birth] AS dateOfBirth,
			${dateTimeUtil.dbDate2utcDate('C.[Date of Birth]', user.companyTimezone)} AS dateOfBirth,
			C.[Business Phone] AS businessPhone,
			C.[Home Phone] AS homePhone,
			C.[Mobile Phone] AS mobile,
			STUFF((SELECT ', ' + S.[Skill Name] FROM Skills S JOIN [Carers Skills] CS ON S.[SkillNo] = CS.[SkillNo] WHERE CS.[Carer ID] = C.[ID] FOR XML PATH('')), 1, 2, '') AS skills,
			STUFF((SELECT ', ' + L.[RefName] FROM [Ref Types] L JOIN [Carers Languages] CL ON L.[RefNo] = CL.[Language Ref ID] WHERE CL.[Carer ID] = C.[ID] FOR XML PATH('')), 1, 2, '') AS languages,
			--C.[Available From Date] AS availableFromDate,
			${dateTimeUtil.dbDate2utcDate('C.[Available From Date]', user.companyTimezone)} AS availableFromDate,
			--C.[Available To Date] AS availableToDate
			${dateTimeUtil.dbDate2utcDate('C.[Available To Date]', user.companyTimezone)} AS availableToDate
		FROM Carers C `;

	let where = `WHERE C.[CompanyID] = ${user.companyId} `;

	if (queryParams.activeOnly != undefined) {
		where +=
			(where.length == 0 ? 'WHERE' : 'AND') +
			' (C.[Available To Date] IS NULL OR (C.[Available To Date] > GETDATE())) AND [Deceased] = 0 ';
	} else if (queryParams.toDate) {
		// Get active carers by selected date
		where +=
			(where.length == 0 ? 'WHERE' : 'AND') +
			` (C.[Available To Date] IS NULL OR (C.[Available To Date] > '${queryParams.toDate}')) AND [Deceased] = 0 `;
	}

	query += where;

	query2 = `SELECT RTRIM([Sort Carers]) AS sortCarers FROM [System Parameters] WHERE [CompanyID] = ${user.companyId}`;
	const queryResult2 = await database.simpleExecute(query2);
	console.log('sortCarers: ' + queryResult2.recordset[0].sortCarers);
	if (queryResult2.recordset[0].sortCarers === 'First Name') query += 'ORDER BY C.[First Name] ';
	else query += 'ORDER BY C.[Last Name] ';
	//console.log(query);

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getCarers = getCarers;

async function getCarer(user, carerId) {
	console.log('Run: function getCarer(user, carerId) ');
	//console.log(`employeeId: ${user.employeeId}`);
	console.log(`carerId: ${carerId}`);

	let query = ``;
	if (carerId !== undefined) {
		// Get carer information by id
		query = `SELECT 
                C.[ID] AS id, 
                C.[First Name] + ' ' +  C.[Last Name] AS name, 
                C.[First Name] AS firstName, 
                C.[Last Name] AS lastName,
                C.[Address] AS address,
                C.[City] AS locality,
                C.[State/Province] AS state,
				C.[Zip/Postal Code] AS postcode,
				P.[ID] AS localityId,
                C.[Country/Region] AS country,
                C.[Home Phone] AS homePhone,
                C.[Mobile Phone] AS mobile,
				C.[Business Phone] AS businessPhone, 
				C.[Fax Number] AS faxNumber,
                C.[E-mail Address] AS email,
				C.[Preferred Contact Method] AS preferredContactMethod,
				C.[Company] AS company,
				C.[ABN] AS ABN,
				C.[Tax File No] AS taxFileNo,
				${dateTimeUtil.dbDate2utcDate('C.[Date of Birth]', user.companyTimezone)} AS dateOfBirth,
                C.[Gender] As gender,
                C.[Transport Mode] AS transportMode,
                C.[Card ID] AS cardId,
				C.[Notes] as notes,
				C.[Emergency Name] AS emergencyName,
				C.[Emergency Phone] AS emergencyPhone,
				C.[Emergency Mobile] AS emergencyMobile,
				C.[Emergency Email] AS emergencyEmail,
				C.[Nurse] AS nurse,
				C.[Medical Notes] AS medicalNotes,
				C.[AttachmentsPath] AS attachmentsPath,
				${dateTimeUtil.dbDate2utcDate('C.[Available From Date]', user.companyTimezone)} AS availableFromDate,
				${dateTimeUtil.dbDate2utcDate('C.[Available To Date]', user.companyTimezone)} AS availableToDate,
				C.[Available Comments] AS availableComments,
				C.[Available School Holidays] AS availableSchoolHolidays, 
				C.[Available 24hr Shifts] AS available24hrShifts,
				C.[Available Overnight Shifts] AS availableOvernightShifts
			FROM [Carers] C
			LEFT JOIN [Post Codes AU] P ON P.[Locality] = C.[City] AND P.[State] = C.[State/Province] AND P.[PCode] = C.[Zip/Postal Code]
            WHERE C.[ID] = ${carerId} AND C.[CompanyId] = ${user.companyId}`;
	}

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getCarer = getCarer;

// Update carer detail information
async function updateCarer(user, id, data) {
	console.log('Run: function updateCarer(user, id, data)');

	if (data.localityId) {
		const rows = await refPostCode.getRefPostCode(user, data.localityId);
		if (rows.length === 1) {
			data.locality = rows[0].localityLower;
			data.state = rows[0].state;
			data.postcode = rows[0].postcode;
		}
	}

	let keyValueList = mapDataForUpdate(data, dbModel, dbModel.primaryKey, user.companyTimezone);

	const stmt = `UPDATE ${dbModel.tableName} SET ${keyValueList}
				 WHERE ${dbModel.primaryKey} = ${id} AND ${dbModel.dataFields.companyId} = ${user.companyId}`;
	console.log(stmt);

	const result = await database.simpleExecute(stmt);
	//console.log(result);
	return result;
}
module.exports.updateCarer = updateCarer;

async function addCarer(user, data) {
	console.log('Run: function addCarer(user, data)');

	// Duplicate Detection
	if (data.dateOfBirth === undefined) {
		return { message: 'Date of Birth is Mandatory' };
	}
	const query = `SELECT 
					[ID] AS id 
				FROM CARERS 
				WHERE [CompanyID] = ${user.companyId}
				  AND [First Name] = '${data.firstName}' 
				  AND [Last Name] = '${data.lastName}' 
				  AND CAST([Date of Birth] AS DATE) = CAST(DATEADD(HOUR,12,'${data.dateOfBirth}') AS DATE)`;

	console.log(query);
	let result = await database.simpleExecute(query);

	if (result.recordset.length === 0) {
		if (data.localityId) {
			const rows = await refPostCode.getRefPostCode(user, data.localityId);
			if (rows.length === 1) {
				data.locality = rows[0].localityLower;
				data.state = rows[0].state;
				data.postcode = rows[0].postcode;
			}
		}

		let [ fieldList, valueList ] = mapDataForInsert(data, dbModel, dbModel.primaryKey, user.companyTimezone);
		const stmt = `INSERT INTO ${dbModel.tableName} ([CompanyID],${fieldList}) OUTPUT INSERTED.${dbModel.primaryKey} AS id VALUES (${user.companyId},${valueList});`;

		console.log(stmt);
		result = await database.simpleExecute(stmt);
		console.log(result);
	} else {
		console.log('Duplicate detected');
		//let carer = rows[0];
	}
	return result;
}
module.exports.addCarer = addCarer;

async function getCarerUnavailable(user, carerId) {
	console.log('Run: function getCarerUnavailable(user, carerId)');
	console.log(`carerId: ${carerId}`);

	let query = ``;
	if (carerId !== undefined) {
		// Get carer availability by carer id
		query = `SELECT 
			[CarerUnavailableSeqNo] AS id,
			[Carer ID] AS carerId,
			[Start Date] AS startDate,
			[Start Time] AS startTime,
			[Finish Date] AS finishDate,
			[End Time] AS endTime,
			[Comments] AS text
		FROM [Carers Unavailability]
		WHERE [Carer ID] = ${carerId}
		ORDER BY [Start Date], [Start Time]`;
	}

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getCarerUnavailable = getCarerUnavailable;

async function getCarerUnavailability(user, carerId, queryParams) {
	console.log('Run: function getCarerUnavailability(user, carerId)');

	let query = '';
	var currentDate = new Date();
	let startDate = null;
	let endDate = null;
	let date = queryParams.date == undefined ? currentDate : parseISO(queryParams.date);
	let view = queryParams.view == undefined ? 'month' : queryParams.view;
	let dateFormat = 'yyyy-MM-dd';

	if (view == 'month') {
		startDate = dateFns.format(dateFns.startOfMonth(date), dateFormat);
		endDate = dateFns.format(dateFns.endOfMonth(date), dateFormat);
	}

	if (view == 'week' || view == 'workWeek' || view == 'agenda') {
		startDate = dateFns.format(dateFns.startOfWeek(date, { weekStartsOn: 1 }), dateFormat);
		endDate = dateFns.format(dateFns.endOfWeek(date, { weekStartsOn: 1 }), dateFormat);
	}

	if (view == 'day') {
		startDate = dateFns.format(date, dateFormat);
		endDate = dateFns.format(date, dateFormat);
	}

	if (carerId !== undefined) {
		// Get carer availability by carer id
		query = `
		SELECT * FROM (
			SELECT 
			CASE
				WHEN ([Start Time] IS NOT NULL) THEN DATEADD(HOUR,DATEPART(HOUR, [Start Time]) - ${dateTimeUtil.getOffset(
					'[Start Date]',
					'AUS Eastern Standard Time'
				)},DATEADD(MINUTE,DATEPART(MINUTE, [Start Time]),[Start Date]))
				WHEN ([Start Time] IS NULL) THEN DATEADD(HOUR,-${dateTimeUtil.getOffset(
					'[Start Date]',
					'AUS Eastern Standard Time'
				)},[Start Date])
			END AS startDate
			,CASE
				WHEN ([End Time] IS NOT NULL) THEN DATEADD(HOUR,DATEPART(HOUR, [End Time]) - ${dateTimeUtil.getOffset(
					'[Finish Date]',
					'AUS Eastern Standard Time'
				)},DATEADD(MINUTE,DATEPART(MINUTE, [End Time]),[Finish Date]))
				WHEN ([End Time] IS NULL) THEN DATEADD(HOUR,-${dateTimeUtil.getOffset(
					'[Finish Date]',
					'AUS Eastern Standard Time'
				)},[Finish Date] + 1)
			END AS endDate
			,CASE
				WHEN (DATEDIFF(day, [Start Date], [Finish Date]) =0 AND ([Start Time] IS NOT NULl AND [End Time] IS NOT NULL)) THEN 
				[Comments] + ' (' + CONVERT(VARCHAR(10), CAST([Start Time] AS TIME), 0) + ' ' +  CONVERT(VARCHAR(10), CAST([End Time] AS TIME), 0) + ') '
				ELSE [Comments]
			END AS text
			, 'Unavailability' AS eventType
			, 1 AS eventTypeCode
			FROM [Carers Unavailability]
			WHERE [Carer ID] = ${carerId}) AS A
			WHERE ${dateTimeUtil.areRangesOverlapping('startDate', 'endDate', `'${startDate}'`, `'${endDate}'`)}
			ORDER BY startDate
			`;
	}

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getCarerUnavailability = getCarerUnavailability;

async function getCarerUnavailableDay(user, carerId, queryParams) {
	console.log('Run: function getCarerUnavailable(user, carerId)');
	console.log(`carerId: ${carerId}`);

	let query = '';
	var currentDate = new Date();
	let startDate = null;
	let endDate = null;
	let date = queryParams.date == undefined ? currentDate : parseISO(queryParams.date);
	let view = queryParams.view == undefined ? 'month' : queryParams.view;
	let dateFormat = 'yyyy-MM-dd';

	if (view == 'month') {
		startDate = dateFns.format(dateFns.startOfMonth(date), dateFormat);
		endDate = dateFns.format(dateFns.endOfMonth(date), dateFormat);
	}

	if (view == 'week' || view == 'workWeek' || view == 'agenda') {
		startDate = dateFns.format(dateFns.startOfWeek(date, { weekStartsOn: 1 }), dateFormat);
		endDate = dateFns.format(dateFns.endOfWeek(date, { weekStartsOn: 1 }), dateFormat);
	}

	if (view == 'day') {
		startDate = dateFns.format(date, dateFormat);
		endDate = dateFns.format(date, dateFormat);
	}

	if (carerId !== undefined) {
		// Get carer availability by carer id
		query = `SELECT * FROM (
			SELECT 
				CASE
					WHEN ([Start Time] IS NOT NULL) THEN NULL
					ELSE [Start Time] 
				END AS StartTime
				,CASE
					WHEN ([Start Time] IS NOT NULL) THEN [Start Date] + 1
					ELSE [Start Date]
				END AS StartDate
				,CASE
					WHEN ([End Time] IS NOT NULL) THEN NULL
					ELSE [End Time] 
				END AS EndTime
				,CASE
					WHEN ([End Time] IS NOT NULL) THEN [Finish Date] - 1
					ELSE [Finish Date]
				END AS EndDate
				
			FROM [Carers Unavailability]
			WHERE [Carer ID] = ${carerId}) AS A
		WHERE ${dateTimeUtil.areRangesOverlapping('StartDate', 'EndDate', `'${startDate}'`, `'${endDate}'`)}
		ORDER BY [StartDate]`;
	}
	//https://date-fns.org/v1.29.0/docs/eachDay
	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getCarerUnavailableDay = getCarerUnavailableDay;

async function getCarerBirthdays(user, queryParams) {
	console.log('Run: function getCarerBirthdays(user, queryParams)');
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
			C.[Mobile Phone] AS	mobile,
			C.[E-mail Address] AS email
		FROM Carers C `;

	let where = `WHERE C.[Date of Birth] IS NOT NULL AND C.[CompanyID] = ${user.companyId} `;

	if (queryParams.activeOnly != undefined) {
		where +=
			(where.length == 0 ? 'WHERE' : 'AND') +
			' (C.[Available To Date] IS NULL OR (C.[Available To Date] > GETDATE())) AND [Deceased] = 0 ';
	} else if (queryParams.toDate) {
		// Get active carers by selected date
		where +=
			(where.length == 0 ? 'WHERE' : 'AND') +
			` (C.[Available To Date] IS NULL OR (C.[Available To Date] > '${queryParams.toDate}')) AND [Deceased] = 0 `;
	}

	query += where;

	query += 'ORDER BY birthDay, name';

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getCarerBirthdays = getCarerBirthdays;

async function getCarerTimesheetsAllocations(user, queryParams) {
	console.log('Run: function getCarerTimesheetsAllocations(user, queryParams)');
	console.log(queryParams);

	const startDate = `'${queryParams.startDate}'`;
	const endDate = `'${queryParams.endDate}'`;

	// Fields to select
	let query = `SELECT
			[ID] AS id,
			[Booking Date] AS bookingDate,
			[Carer] AS carerName,
			[Client Name] AS clientName,
			[Invoice Client] AS invoiceTo,
			[Task Name] AS taskName,
			[Hours Charged] AS hoursCharged,
			[Shifts Charged] AS shiftsCharged,
			[KMs Charged] AS kmsCharged,
			[Job Ref] AS jobRef,
			[Activity ID] AS activityId
			FROM [vwBookingsChargesDetails] `;

	let where = `WHERE [CompanyID] = ${user.companyId}
			  AND [Booking Date] >= ${dateTimeUtil.utcDate2dbDate(startDate, user.companyTimezone)}
			  AND [Booking Date] <= ${dateTimeUtil.utcDate2dbDate(endDate, user.companyTimezone)} `;

	if (queryParams.carerId != undefined) {
		where += `AND [Carer ID] = ${queryParams.carerId} `;
	}

	query += where;

	query += 'ORDER BY [Carer], [Booking Date]';

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getCarerTimesheetsAllocations = getCarerTimesheetsAllocations;
