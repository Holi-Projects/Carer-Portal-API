const database = require('../../services/database.js');
const dateFns = require('date-fns');
const parseISO = require('date-fns/parseISO');
const dateTimeUtil = require('../../utils/dateTimeUtil');
const { mapDataForSelectMultipleTables, mapDataForUpdateMultipleTables } = require('../../utils/mapUtils');
const { bookingDbModel } = require('../../db_model/booking');

async function get(user, id) {
	console.log('booking.get()');
	console.log(user.userType);
	let fieldList = mapDataForSelectMultipleTables(bookingDbModel, user.companyTimezone);
	query = `SELECT ${fieldList},C.[First Name] + N' ' + C.[Last Name] AS clientName
		,B.Title AS taskName
		,B.[Task Name] AS taskCode
		, CASE WHEN G.[Carer Portal Show Client Phone] = 1 THEN C.[Home Phone] ELSE 'Call Office' END AS clientHomePhone2
        , CASE WHEN G.[Carer Portal Show Client Phone] = 1 THEN C.[Mobile Phone] ELSE 'Call Office' END AS clientMobilePhone2
		, C.Address + N', ' + C.City AS clientAddress
		, E.[First Name] + N' ' + E.[Last Name] AS carerName
		, F.[First Name] +  N' ' + F.[Last Name] AS modifiedByEmployee
		, (CASE
            WHEN (A.[Date Cancelled] IS NULL AND A.[Date Time Confirmed] IS NULL) THEN 'Unconfirmed Shift'
			WHEN (A.[Date Time Confirmed] IS NOT NULL AND A.[Date Time Approved] IS NULL AND A.[Date Time Rejected] IS NULL) THEN 'Confirmed Shift'
			WHEN (A.[Date Time Confirmed] IS NOT NULL AND A.[Date Time Approved] IS NULL AND A.[Date Time Rejected] IS NULL) THEN 'Approved Shift'
			WHEN (A.[Date Time Rejected] IS NOT NULL) THEN 'Rejected Shift'
			ELSE 'Unknown Status'
        END) as shiftStatus
		, (CASE
            WHEN (A.[Date Cancelled] IS NULL AND A.[Date Time Confirmed] IS NULL) THEN 1
			WHEN (A.[Date Time Confirmed] IS NOT NULL AND A.[Date Time Approved] IS NULL AND A.[Date Time Rejected] IS NULL) THEN 2
			WHEN (A.[Date Time Confirmed] IS NOT NULL AND A.[Date Time Approved] IS NOT NULL AND A.[Date Time Rejected] IS NULL) THEN 3
			WHEN (A.[Date Time Rejected] IS NOT NULL) THEN 4
			ELSE 5
		END) as shiftStatusCode`;

	query +=
		`\nFROM dbo.Bookings A
	LEFT JOIN dbo.Tasks B ON B.ID = A.[Task ID]
	LEFT JOIN dbo.Clients C ON C.ID = A.[Client ID]
	LEFT JOIN dbo.[Ref Pricing Groups] D ON A.[PricingGroupNo] = D.[PricingGroupNo]
	LEFT JOIN dbo.Carers E ON (A.[Carer ID] = E.ID AND E.[CompanyID] = ${user.companyId})
	LEFT JOIN dbo.[Employees] F ON F.ID = A.[ModifiedBy]	
	LEFT JOIN [System Parameters] G ON G.[CompanyID] = E.[CompanyID]	
	WHERE A.ID = ` + id;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.get = get;

async function getList(user, queryParams) {
	console.log('booking.getList((user, queryParams)');
	//weekStartsOn: [Roster Start Weekday] System parameters
	let query = '';
	var currentDate = new Date();
	//let startDate = null;
	//let endDate = null;
	let startDate = queryParams.startDate == undefined ? null : parseISO(queryParams.startDate);
	let endDate = queryParams.endDate == undefined ? null : parseISO(queryParams.endDate);
	let date = queryParams.date == undefined ? currentDate : parseISO(queryParams.date);
	let view = queryParams.view == undefined ? 'month' : queryParams.view;
	let dateFormat = 'yyyy-MM-dd';
	let clientId =
		queryParams.clientId == undefined ? (user.userType == 'client' ? user.userId : null) : queryParams.clientId;
	let carerId =
		queryParams.carerId == undefined ? (user.userType == 'carer' ? user.userId : null) : queryParams.carerId;

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

	query += `
		DECLARE @clientId INT = ${clientId}
		DECLARE @carerId INT = ${carerId}
		SELECT  b.ID AS id
		, a.ID AS carerId
		, a.[First Name] + ' ' +  a.[Last Name] AS carerName
		, b.[Client Schedule Seq No] AS clientScheduleSeqId
		, c.[Task Name] AS taskCode
		, c.[ID] as taskId
		, c.[Title] AS taskName
		, c.Description AS description
		, d.[ID] AS clientId
		, d.[First Name] + ' ' +  d.[Last Name] AS clientName
		, d.[Address] + ', ' + d.[City] as clientAddress
		, 'Booking' AS eventType
		, 0 AS eventTypeCode
		, (CASE
				WHEN (@clientId IS NULL AND @carerId IS NOT NULL) THEN d.[First Name] + ' ' + d.[Last Name] + ', ' + RTRIM([Activity ID])
				WHEN (@clientId IS NOT NULL AND @carerId IS NULL) THEN a.[First Name] + ' ' + a.[Last Name] + ', ' + RTRIM([Activity ID])
				WHEN (@carerId IS NULL AND @carerId IS NULL) THEN d.[First Name] + ' ' + d.[Last Name] + ' (' + a.[First Name] + ' ' + a.[Last Name] + '), ' + RTRIM([Activity ID])
		 END) as text
		, ${dateTimeUtil.dbDate2utcDate('b.[Booking Date]', user.companyTimezone)} AS date
		, ${dateTimeUtil.dbDate2utcDate('b.[Start Time]', user.companyTimezone)} AS startDate
		, ${dateTimeUtil.dbDate2utcDate('b.[End Time]', user.companyTimezone)} AS endDate
		, (CASE
				WHEN (b.[Date Cancelled] IS NULL AND b.[Date Time Confirmed] IS NULL AND b.[Booking Date] > GETDATE()) THEN 'Current Roster'
				WHEN (b.[Date Cancelled] IS NULL AND b.[Date Time Confirmed] IS NULL AND b.[Booking Date] <= GETDATE()) THEN 'Unconfirmed Shift'
				WHEN (b.[Date Time Confirmed] IS NOT NULL AND b.[Date Time Approved] IS NULL AND b.[Date Time Rejected] IS NULL) THEN 'Confirmed Shift'
				WHEN (b.[Date Time Confirmed] IS NOT NULL AND b.[Date Time Approved] IS NOT NULL AND b.[Date Time Rejected] IS NULL) THEN 'Approved Shift'
				WHEN (b.[Date Time Rejected] IS NOT NULL) THEN 'Rejected Shift'
				ELSE 'Unknown Status'
		END) as shiftStatus
		, (CASE
				WHEN (b.[Date Cancelled] IS NULL AND b.[Date Time Confirmed] IS NULL AND b.[Booking Date] >= DATEADD(d, - 1, GETDATE())) THEN 5
				WHEN (b.[Date Cancelled] IS NULL AND b.[Date Time Confirmed] IS NULL AND b.[Booking Date] < DATEADD(d, - 1, GETDATE())) THEN 1
				WHEN (b.[Date Time Confirmed] IS NOT NULL AND b.[Date Time Approved] IS NULL AND b.[Date Time Rejected] IS NULL) THEN 2
				WHEN (b.[Date Time Confirmed] IS NOT NULL AND b.[Date Time Approved] IS NOT NULL AND b.[Date Time Rejected] IS NULL) THEN 3
				WHEN (b.[Date Time Rejected] IS NOT NULL) THEN 4
				ELSE 5
		END) as shiftStatusCode
			FROM  dbo.Carers a
			LEFT OUTER JOIN dbo.Bookings b 
			ON (a.ID = b.[Carer ID] 
			AND a.[CompanyID] = ${user.companyId}
			AND [Cancel Charges]=0)
			LEFT OUTER JOIN [dbo].[Tasks] c ON b.[Task ID] = c.ID
			LEFT OUTER JOIN [dbo].[Clients] d ON b.[Client ID] =  d.[ID]
			WHERE a.Deceased = 0 
		`;

	if (view !== 'all') {
		query += `\nAND ([Available To Date] IS NULL OR [Available To Date] >= '${startDate}') 
					AND ( b.[Booking Date] >= '${startDate}'  AND b.[Booking Date] <= '${endDate}')`;
	}

	if (queryParams.status === 'unconfirmed')
		query += `\nAND (b.[Date Cancelled] IS NULL AND b.[Date Time Confirmed] IS NULL AND b.[Booking Date] <= GETDATE())`;

	if (clientId !== null) query += `\nAND b.[Client ID]  = ` + clientId;
	if (carerId !== null) query += `\nAND b.[Carer ID]  = ` + carerId;

	query += `\nORDER BY b.[Booking Date], b.[Start Time];`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.getList = getList;

//Update carer availability information
async function update(user, data) {
	console.log('DB:carersDays.update(user, carerId, data)');
	console.log(data)
	let query = ``;
	let keyValueList = mapDataForUpdateMultipleTables(data, bookingDbModel, user.companyTimezone);

	for (let [ key, value ] of Object.entries(data)) {
		if (Object.keys(value.data).length > 0) {
			query += `UPDATE ${key} SET ${keyValueList[key]} WHERE ${bookingDbModel.primaryKeys[key]
				.id} = ${value.key}\n`;
		}
			// query +=`UPDATE [Bookings] SET [Chargeable Hrs] = `;
	}
	// query += `UPDATE [bookings] SET ${keyValueList} WHERE ${bookingDbModel.primaryKeys.bookings.id}=${data.bookings.id}`;
	// query += `UPDATE [carer] SET ${keyValueList} WHERE ${bookingDbModel.primaryKeys.bookings.id}=${data.bookings.id}`;

	console.log(query);

	const result = await database.simpleExecute(query);
	//console.log(result);
	return result;
}

module.exports.update = update;

async function remove(user, id) {
	console.log('DB:booking.remove(user, id)');
	//  Start transaction
	let query = `BEGIN TRY
		BEGIN TRANSACTION ;
		SET IMPLICIT_TRANSACTIONS ON;\n`;
	
		query += `DELETE FROM [Bookings Agencies Reporting] 
			 WHERE BookingID = ${id}`;
			 
		query += `\nDELETE FROM [Bookings Charges] 
             OUTPUT DELETED.SeqNo AS id 
			 WHERE BookingID = ${id}`;

		query += `\nDELETE FROM [Bookings Charges Splits] 
			 WHERE [BookingChargeSeqNo] =  @@IDENTITY`;		
			 
		query += `\nDELETE FROM [Bookings Funding] 
			 WHERE BookingID = ${id}`;

		query += `\nDELETE FROM [Bookings] 
			 OUTPUT DELETED.ID AS id 
			 WHERE ID= ${id}`;

			 	// Finish transaction
		query += `
		COMMIT TRANSACTION;  
		END TRY\n
		BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRAN

			DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE()
			DECLARE @ErrorSeverity INT = ERROR_SEVERITY()
			DECLARE @ErrorState INT = ERROR_STATE()

		-- Use RAISERROR inside the CATCH block to return error  
		-- information about the original error that caused  
		-- execution to jump to the CATCH block.  
		RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
		END CATCH
		IF @@TRANCOUNT > 0  
			COMMIT TRANSACTION
		GO`;
			 
	console.log(query);
	const result = await database.simpleExecute(query);
	console.log(result);
	return result;
}
module.exports.remove = remove;

