const database = require('../services/database.js');
const dateFns = require('date-fns');
const parseISO = require('date-fns/parseISO');
const dateTimeUtil = require('../utils/dateTimeUtil');
const dbField = {
	id                 : '[ID]',
	companyId          : '[CompanyID]',
	carerComments      : '[Carer Comments]',
	carerKMs           : '[Carer KMs]',
	carerDisbursements : '[Carer Disbursements]',
	carerStartTime     : '[Carer Start Time]',
	carerEndTime       : '[Carer End Time]',
	confirmedDateTime  : '[Date Time Confirmed]',
};

const dateFields = [
	'[Booking Date]',
	'[Date Advised Carer]',
	'[Date Advised Client]',
	'[Date Advised Agency]',
	'[Carer Start Time]',
	'[Carer End Time]',
	'[Date Time Confirmed]',
];

async function getBookingDetails(user, id) {
	console.log('getBookingDetails()');
	console.log(user.userType);
	query = `SELECT A.ID as id
		,A.[Client ID] as clientId
		,A.[Task ID] as taskId
		,A.[Carer ID] as carerId
		--,A.[Booking Date] as date
		--,DATEADD(HOUR,-10,A.[Start Time]) as startTime
		--,DATEADD(HOUR,-10,A.[End Time]) as endTime
		--,A.[Date Cancelled] as cancelledDate
		,${dateTimeUtil.dbDate2utcDate('A.[Booking Date]', user.companyTimezone)} AS date
		,${dateTimeUtil.dbTime2utcDate('A.[Start Time]', user.companyTimezone)} AS startTime
		,${dateTimeUtil.dbTime2utcDate('A.[End Time]', user.companyTimezone)} AS endTime
		,${dateTimeUtil.dbDate2utcDate('A.[Date Cancelled]', user.companyTimezone)} AS cancelledDate
		,A.[Cancel Charges] as cancelCharges
		,A.[ShiftTypeNo] as shiftTypeId
		,C.[First Name] + N' ' + C.[Last Name] AS clientName
		,A.[Advise Comments] as adviseComments
		,B.Title AS taskName
		,B.[Task Name] AS taskCode
		, CASE WHEN G.[Carer Portal Show Client Phone] = 1 THEN C.[Home Phone] ELSE 'Call Office' END AS clientHomePhone2
		, CASE WHEN G.[Carer Portal Show Client Phone] = 1 THEN C.[Mobile Phone] ELSE 'Call Office' END AS clientMobilePhone2
		, C.Address + N', ' + C.City AS clientAddress
		, E.[First Name] + N' ' + E.[Last Name] AS carerName
		, A.[AddMethod] AS addMethod
		--, CONVERT(VARCHAR(20), A.[DateAdded],120)  AS addedDate
		,${dateTimeUtil.dbDate2utcDate('A.[DateAdded]', user.companyTimezone)} AS addedDate
		, F.[First Name] +  N' ' + F.[Last Name] AS modifiedByEmployee
		--, A.[LastModified] AS lastModified
		,${dateTimeUtil.dbDate2utcDate('A.[LastModified]', user.companyTimezone)} AS LastModified
		, A.[Carer Comments] as carerComments
		, A.[Carer KMs] as carerKMs
		, A.[Carer Disbursements] as carerDisbursements
		, C.[Employee Manager ID] AS employeeManagerId
		, F.[First Name] + ' ' + F.[Last Name] AS carerManager
		--, A.[Carer Start Time] AS carerStartTime
		--, A.[Carer End Time] AS carerEndTime
		--, A.[Date Time Confirmed] AS confirmedDateTime
		--, A.[Date Time Approved] AS approvedDateTime
		--, A.[Date Time Rejected] AS rejectedDateTime
		,${dateTimeUtil.dbTime2utcDate('A.[Carer Start Time]', user.companyTimezone)} AS carerStartTime
		,${dateTimeUtil.dbTime2utcDate('A.[Carer End Time]', user.companyTimezone)} AS carerEndTime
		,${dateTimeUtil.dbDate2utcDate('A.[Date Time Confirmed]', user.companyTimezone)} AS confirmedDateTime
		,${dateTimeUtil.dbDate2utcDate('A.[Date Time Approved]', user.companyTimezone)} AS approvedDateTime
		,${dateTimeUtil.dbDate2utcDate('A.[Date Time Rejected]', user.companyTimezone)} AS rejectedDateTime

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

	if (user.userType !== 'carer' && user.userType !== 'client') {
		query += `\n,A.PricingGroupNo as pricingGroupId
		, D.[PricingGroupName] AS pricingGroupName 
		,A.[Date Advised Carer] as dateAdvisedCare
		,A.[Contact Method] as contactMethod
		,A.Location as location
		,A.Description as description
		,A.[Charged Disbursements] as chargedDisbursements
		,A.[Additional Charge] as additionalCharge
		,A.[Additional Charge Description] as additionalChargeDescription
		,A.[Invoice Comments] as invoiceComments
		,A.[Carer Payment Comments] as carerPaymentComments
		,A.[Client Schedule Seq No] as clientScheduleSeqNo
		,C.[NDIS Client] AS ndisClient
		,C.[Invoice Reference] as invoiceReference	
		,B.[Activity ID] AS activityId
		,C.[E-mail Address] AS clientEmail
		, C.[Home Phone] AS clientHomePhone
		, C.[Mobile Phone] AS clientMobile
		, C.[Medical Notes] AS medicalNotes
		, C.[Treatment Notes] AS treatmentNotes
		, C.[General Notes] AS generalNotes
		, C.[Preferred Contact Method] AS clientPreferredContactMethod
		, E.[E-mail Address] AS carerEmail
		, E.[Business Phone] AS carerBusinessPhone
		, E.[Home Phone] AS carerHomePhone
		, E.[Mobile Phone] AS carerMobile
		, E.City AS carerCity
		, E.[Available From Date] AS availableFromDate
		, E.[Available To Date] AS availableToDate
		, E.[Available Comments] AS availableComments
		, E.[Not Available From Date] AS notAvailableFromDate
		, E.[Not Available To Date] AS notAvailableToDate
		, E.[Not Available Comments] AS notAvailableComment
		, E.[Preferred Contact Method] AS carerPreferredContactMethod
		, E.Company AS agencyName
		, A.[AllowRepopulation] AS allowRepopulation
		, A.[Chargeable Hrs] AS chargeableHrs
        , A.[Chargeable Shifts]  AS chargeableShifts
        , A.[Chargeable KMs] AS chargeableKMs`;
	}
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

module.exports.getBookingDetails = getBookingDetails;

async function getBookingFundings(user, id) {
	console.log('getBookingFundings()');
	query = ` SELECT G.Company AS invoiceToAgencyName
		, F.[Last Name] + ', ' + F.[First Name] AS invoiceToClientName
		, CONVERT(DECIMAL(10,2),B.[Percentage Charged]*100) AS chargedPercentage
		, D.PricingGroupName AS pricingGroupName
		FROM [dbo].[Bookings] A
		LEFT JOIN [dbo].[Bookings Funding] B  ON A.[ID] = B.BookingID
		LEFT JOIN [dbo].[Bookings Charges Splits] C ON B.BookingFundingNo = C.BookingFundingNo
		LEFT JOIN [dbo].[Ref Pricing Groups] D ON C.PricingGroupNo = D.PricingGroupNo
		LEFT JOIN [dbo].[Clients] F ON C.[Invoice To Client ID] = F.[ID]
		LEFT JOIN [dbo].[Agencies] G ON C.[Invoice To Agency ID] = G.[ID]
		WHERE A.ID = ${id}
		AND A.CompanyID = ${user.companyId}`;
	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.getBookingFundings = getBookingFundings;

async function getBookingPayments(user, id) {
	console.log('getBookingPayments()');
	query = `SELECT E.[PeriodTypeName] AS rateType
		, D.[Charge Rate Description] AS qtyType
		, B.[Qty Charged] AS chargedQty
		, B.[Shifts Charged] AS chargedShifts 
		, B.[KMs Charged] AS chargedKMs
		, B.[Pay Rate Hour] AS payRateHour
		, B.[Pay Rate Shift] AS payRateShift
		, B.[Pay Rate Km] AS payRateKm
		, B.[Payable Amount] AS payableAmount
		, C.[Pay Type Description] AS payType
		FROM [dbo].[Bookings] A
		JOIN [dbo].[Bookings Charges] B ON A.[ID] = B.BookingID
		LEFT JOIN [dbo].[Pay Rate Types] C ON B.PayRateTypeNo = C.PayRateTypeNo
		LEFT JOIN [dbo].[Ref Charge Rate Types] D ON B.ChargeTypeNo = D.ChargeTypeNo
		LEFT JOIN [dbo].[Ref Period Types] E ON E.PeriodTypeNo = C.PeriodTypeNo
		WHERE A.ID = ${id}
		AND A.CompanyID = ${user.companyId}`;
	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.getBookingPayments = getBookingPayments;

async function getBookingCharges(user, id) {
	console.log('getBookingCharges()');
	query = `  SELECT RPT.[PeriodTypeName] AS rateType
		, BCS.[Charge Rate Qty] AS chargeRateQty
		, BCS.[Charge Rate Shift] AS chargeRateShift
		, BCS.[Charge Rate Km] AS chargeRateKm
		, BCS.[Invoice No] AS invoiceNo
		, BCS.[Charge GST] AS chargeGST
		, BCS.[Total GST] AS totalGST
		, BCS.[Total Charge] AS totalChargeExGST
		, (BCS.[Total Charge]+ BCS.[Total GST]) AS totalCharge
		, BCS.[Date Invoiced] AS invoicedDate
		, CASE WHEN (BC.[Invoice To Agency ID] IS NULL AND BC.[Invoice To Client ID] IS NOT NULL) THEN C.[Last Name] + ', ' + C.[First Name]
		ELSE A.[Company] END AS invoiceToClientOrAgency
		FROM [dbo].[Bookings] B
		LEFT JOIN [dbo].[Bookings Charges] BC ON B.[ID] = BC.BookingID
		LEFT JOIN [dbo].[Pay Rate Types] PR ON BC.PayRateTypeNo = PR.PayRateTypeNo
		LEFT JOIN [dbo].[Bookings Funding] BF  ON B.[ID] = BF.BookingID
		LEFT JOIN [dbo].[Bookings Charges Splits] BCS ON BF.BookingFundingNo = BCS.BookingFundingNo
		LEFT JOIN [dbo].[Ref Pricing Groups] RPG ON BCS.PricingGroupNo = RPG.PricingGroupNo
		LEFT JOIN [dbo].[Ref Period Types] RPT ON RPT.PeriodTypeNo = PR.PeriodTypeNo
		LEFT JOIN [dbo].[Clients] C ON B.[Client ID] = C.[ID]
		LEFT JOIN [dbo].[Agencies] A ON BC.[Invoice To Agency ID] = A.[ID]
		WHERE B.ID = ${id}
		AND B.CompanyID = ${user.companyId}`;
	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.getBookingCharges = getBookingCharges;

async function getScheduledBooking(user, queryParams) {
	console.log('getScheduledBooking(user, queryParams)');
	//weekStartsOn: [Roster Start Weekday] System parameters
	const dateFormat = 'yyyy-MM-dd';
	const currentDate = new Date();
	let query = '';
	//let startDate = null;
	//let endDate = null;
	let startDate = queryParams.startDate ? dateFns.format(parseISO(queryParams.startDate), dateFormat) : null;
	let endDate = queryParams.endDate ? dateFns.format(parseISO(queryParams.endDate), dateFormat) : null;
	console.log(startDate);
	console.log(endDate);

	let date = queryParams.date == undefined ? currentDate : parseISO(queryParams.date);
	let view = queryParams.view == undefined ? 'month' : queryParams.view;
	let clientId =
		queryParams.clientId == undefined ? (user.userType == 'client' ? user.userId : null) : queryParams.clientId;
	let carerId =
		queryParams.carerId == undefined ? (user.userType == 'carer' ? user.userId : null) : queryParams.carerId;

	if (view == 'month' && startDate === null && endDate === null) {
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
		--, FORMAT(b.[Booking Date], 'yyyy-MM-dd') AS date
		--, b.[Start Time] AS startTime
		--, b.[End Time] AS endTime
		, c.[Task Name] AS taskCode
		--, c.[Title] AS taskName
		, c.[ID] as taskId
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
			--AND ([Chargeable Hrs]>0 OR [Chargeable Shifts]>0 OR [Chargeable KMs]>0)
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

module.exports.getScheduledBooking = getScheduledBooking;

// Update booking detail information
async function updateBooking(user, bookingId, booking) {
	console.log('Run: function updateBooking(user, bookingId, booking)');

	let fields = [];
	for (let [ key, value ] of Object.entries(booking)) {
		console.log(key, value);

		const dbFieldName = dbField[key];
		if (dbFieldName && dbFieldName !== '[ID]') {
			if (typeof value === 'string') value = `'${value}'`; // strings need to single quoted in SQL
			if (typeof value === 'boolean') value = value ? 1 : 0; // booleans need to be translated from true/false to 1/0 in SQL
			//if (dateFields.includes(dbFieldName)) value = roundDate(value); // Dates (without time) need to be rounded from UTC to nearest date
			if (dateFields.includes(dbFieldName)) value = dateTimeUtil.utcDate2dbDate(value, user.companyTimezone);

			fields.push(`${dbFieldName}=${value}`);
		}
	}
	const fieldList = fields.join();

	const stmt = `UPDATE BOOKINGS SET ${fieldList} WHERE [ID]=${bookingId} AND [CompanyID] = ${user.companyId}`;

	console.log(stmt);
	const result = await database.simpleExecute(stmt);
	//console.log(result);
	return result;
}

module.exports.updateBooking = updateBooking;
