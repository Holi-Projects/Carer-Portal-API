const database = require('../services/database.js');
const dateTimeUtil = require('../utils/dateTimeUtil');
const { mapDataForInsert } = require('../utils/mapUtils');
const { mapDataForUpdate } = require('../utils/mapUtils');
const dateFns = require('date-fns');
const parseISO = require('date-fns/parseISO');

const dataFields = {
	id                   : '[CarerUnavailableSeqNo]',
	carerId              : '[Carer ID]',
	comments             : '[Comments]',
	leaveTypeId          : '[LeaveTypeRefNo]',
	approvedByEmployeeId : '[ApprovedByEmployeeID]',
};
const primaryKey = dataFields.id;

const dateTimeFields = {
	startDate     : '[Start Date]',
	endDate       : '[Finish Date]',
	submittedDate : '[DateSubmitted]',
	approvedDate  : '[DateApproved]',
};

const timeFields = {};

const dbFields = {
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

async function getList(user, carerId, queryParams) {
	console.log('Run: function getCarerUnavailability(user, carerId, queryParams)');

	let query = '';
	var currentDate = new Date();
	let startDate = null;
	let endDate = null;
	let date = queryParams.date == undefined ? currentDate : parseISO(queryParams.date);
	let view = queryParams.view == undefined ? 'month' : queryParams.view;
	let dateFormat = 'yyyy-MM-dd';
	carerId =
		queryParams.carerId == undefined ? carerId : queryParams.carerId;

	if (view == 'month') {
		//startDate = dateFns.format(dateFns.startOfMonth(date), dateFormat);
		//endDate = dateFns.format(dateFns.endOfMonth(date), dateFormat);
		// The Calendar view displays a 6 week period which includes days before and after the month
		// calculate the startDate and endDate to cover the entire period
		const startOfMonth = dateFns.startOfMonth(date);
		const start = dateFns.startOfWeek(startOfMonth, { weekStartsOn: 1 });
		const end = dateFns.addDays(start, 41); // 6*7-1
		startDate = dateFns.format(start, dateFormat);
		endDate = dateFns.format(end, dateFormat);
	}

	if (view == 'week' || view == 'workWeek' || view == 'agenda') {
		startDate = dateFns.format(dateFns.startOfWeek(date, { weekStartsOn: 1 }), dateFormat);
		endDate = dateFns.format(dateFns.endOfWeek(date, { weekStartsOn: 1 }), dateFormat);
	}

	if (view == 'day') {
		startDate = dateFns.format(date, dateFormat);
		endDate = dateFns.format(date, dateFormat);
	}

	if (carerId !== undefined && carerId !== null) {
		// Get carer availability by carer id
		query = `
		SELECT * FROM (
			SELECT 
			[CarerUnavailableSeqNo] AS id
			, ${dateTimeUtil.dbDate2utcDate('[Start Date]', user.companyTimezone)} AS startDate
			, ${dateTimeUtil.dbDate2utcDate('[Finish Date]', user.companyTimezone)} AS endDate
			, [RefName] AS text
			, 'Unavailability' AS eventType
			, 1 AS eventTypeCode
			, null AS taskId
			FROM [Carers Unavailability] AS A
			LEFT JOIN [Ref Types] AS B 
			ON A.LeaveTypeRefNo = B.RefNo
			WHERE [Carer ID] = ${carerId}) AS C
			WHERE ${dateTimeUtil.areRangesOverlapping('startDate', 'endDate', `'${startDate}'`, `'${endDate}'`)}
			ORDER BY startDate
			`;
	}

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getList = getList;

async function list(user, carerId, queryParams) {
	console.log('DB:getCarerUnavailability.list(user, carerId, queryParams)');

	let query = `SELECT 
			A.[CarerUnavailableSeqNo] AS id,
			A.[Carer ID] AS carerId,
			${dateTimeUtil.dbDate2utcDate('A.[Start Date]', user.companyTimezone)} AS startDate,
			${dateTimeUtil.dbDate2utcDate('A.[Finish Date]', user.companyTimezone)} AS endDate,
			A.[Comments] AS comments,
			${dateTimeUtil.dbDate2utcDate('A.[DateSubmitted]', user.companyTimezone)} AS submittedDate,
			${dateTimeUtil.dbDate2utcDate('A.[DateApproved]', user.companyTimezone)} AS approvedDate,
			A.[LeaveTypeRefNo] AS leaveTypeId,
			A.[ApprovedByEmployeeID] AS approvedByEmployeeId,
			B.[First Name] + ' ' +  B.[Last Name] AS approvedBy
		FROM [Carers Unavailability] A
		LEFT JOIN [Employees] B ON A.ApprovedByEmployeeID = B.ID
		LEFT JOIN [Carers] C ON C.[ID] = A.[Carer ID]
		WHERE C.[ID] = ${carerId} 
		AND C.[CompanyId] = ${user.companyId} `;

	if (queryParams.activeOnly != undefined && queryParams.activeOnly === 'true') {
		query += 'AND (A.[START DATE] > GETDATE() OR A.[Finish Date] > GETDATE()) ';
	}
	query += 'ORDER BY A.[Start Date]';

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.list = list;

async function get(user, carerId, id) {
	console.log('DB:getCarerUnavailability.get(user, carerId, id)');
	console.log(`carerId: ${carerId}`);
	console.log(`id: ${id}`);

	let query = ``;
	if (carerId !== undefined && id !== undefined) {
		query = `SELECT 
                A.[CarerUnavailableSeqNo] AS id,
                ${dateTimeUtil.dbDate2utcDate('A.[Start Date]', user.companyTimezone)} AS startDate,
                ${dateTimeUtil.dbDate2utcDate('A.[Finish Date]', user.companyTimezone)} AS endDate,
                A.[Comments] AS comments,
				${dateTimeUtil.dbDate2utcDate('A.[DateSubmitted]', user.companyTimezone)} AS submittedDate,
				${dateTimeUtil.dbDate2utcDate('A.[DateApproved]', user.companyTimezone)} AS approvedDate,
				A.[LeaveTypeRefNo] AS leaveTypeId,
				A.[ApprovedByEmployeeID] AS approvedByEmployeeId,
				B.[First Name] + ' ' +  B.[Last Name] AS approvedBy
			FROM [Carers Unavailability] A
			LEFT JOIN [Employees] B ON A.ApprovedByEmployeeID = B.ID
			LEFT JOIN [Carers] C ON C.[ID] = A.[Carer ID]
            WHERE A.${primaryKey} = ${id}
              AND C.[ID] = ${carerId} 
              AND C.[CompanyId] = ${user.companyId}`;
	}

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.get = get;

// Update carer availability information
async function update(user, carerId, id, data) {
	console.log('DB:carerUnavailability.update(user, carerId, data)');

	let keyValueList = mapDataForUpdate(data, dbFields, primaryKey, user.companyTimezone);

	// if there was no data mapped just update the carerId to the same value to form a valid statement
	if (keyValueList.length === 0) keyValueList = `[Carer ID]=${carerId}`;

	const stmt = `UPDATE [Carers Unavailability] SET ${keyValueList}
				WHERE ${primaryKey}=${id} 
                AND [Carer ID]=${carerId}`;

	console.log(stmt);

	const result = await database.simpleExecute(stmt);
	//console.log(result);
	return result;
}
module.exports.update = update;

async function insert(user, data) {
	console.log('DB:carerUnavailability.insert(user, data)');
	let [ fieldList, valueList ] = mapDataForInsert(data, dbFields, primaryKey, user.companyTimezone);
	//console.log(fields)
	const stmt = `INSERT INTO [Carers Unavailability] (${fieldList}) OUTPUT INSERTED.${primaryKey} AS id VALUES (${valueList});`;

	console.log(stmt);
	result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}
module.exports.insert = insert;

async function isOverlapped(user, startDate, finishDate) {
	console.log('DB:carerUnavailability.isOverlapped(user, startDate, finishDate)');
	query = `
	 DECLARE @startDate DATETIME = ${dateTimeUtil.dbDate2utcDate(startDate, user.companyTimezone)} 
	 DECLARE @endDate DATETIME = ${dateTimeUtil.dbDate2utcDate(finishDate, user.companyTimezone)} 

	 SELECT count(*) FROM (
		 SELECT 
		 ${dateTimeUtil.dbDate2utcDate('[Start Date]', user.companyTimezone)} AS startDate
		 ,${dateTimeUtil.dbDate2utcDate('[Finish Date]', user.companyTimezone)} AS endDate
		 ,[Comments] AS text
		 ,'Unavailability' AS eventType
		 ,1 AS eventTypeCode
		 FROM [Carers Unavailability]
		 WHERE [Carer ID] = ${carerId}) AS A
	AND ${dateTimeUtil.areRangesOverlapping('startDate', 'endDate', `@startDate`, `@endDate`)}`;

	console.log(query);
	result = await database.simpleExecute(query);
	console.log(result);
	return result;
}
module.exports.isOverlapped = isOverlapped;

async function remove(user, carerId, id) {
	console.log('DB:carerUnavailability.remove(user, carerId, id)');

	let stmt = `DELETE FROM [Carers Unavailability] 
        OUTPUT DELETED.${primaryKey} AS id 
        WHERE [Carer ID] = ${carerId}
        AND ${primaryKey} = ${id}`;

	console.log(stmt);
	const result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}
module.exports.remove = remove;
