const database = require('../services/database.js');
const dateFns = require('date-fns');
const parseISO = require('date-fns/parseISO');
const dateTimeUtil = require('../utils/dateTimeUtil');

async function getStandardService(user, queryParams) {
	console.log('getStandardService(context)');
	console.log(queryParams);
	let query = '';
	var currentDate = new Date();
	let startDate = null;
	let endDate = null;
	let date = queryParams.date == undefined ? currentDate : parseISO(queryParams.date);
	let view = queryParams.view == undefined ? 'month' : queryParams.view;
	let dateFormat = 'yyyy-MM-dd';
	let clientId =
		queryParams.clientId == undefined ? (user.userType == 'client' ? user.userId : null) : queryParams.clientId;
	let carerId =
		queryParams.carerId == undefined ? (user.userType == 'carer' ? user.userId : null) : queryParams.carerId;

	// let viewStyle = queryParams.viewStyle;

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

	if (clientId !== null || carerId !== null) {
		// if (viewStyle == 'calendar') {
		query += `DECLARE @Start date ='${startDate}'
        DECLARE @End date ='${endDate}'
        SELECT a.[Client Schedule Seq No] as id
        ,c.ID as taskId
        ,RTRIM(c.[Task Name]) + ' (' + LTRIM(RIGHT(CONVERT(VARCHAR(20), [Start Time], 100), 7)) + ' -' + LTRIM(RIGHT(CONVERT(VARCHAR(20), [End Time], 100), 7)) + ')' as text
        ,CASE
                WHEN [Start Time] >= [End Time]  THEN  DATEADD(HOUR,DATEPART(HOUR, [End Time]) - ${dateTimeUtil.getOffset(
					'[Schedule Start Date]',
					'AUS Eastern Standard Time'
				)},DATEADD(MINUTE,DATEPART(MINUTE, [End Time]),a.[Schedule Start Date]) + 1)
                ELSE DATEADD(HOUR,DATEPART(HOUR, [End Time]) - ${dateTimeUtil.getOffset(
					'[Schedule Start Date]',
					'AUS Eastern Standard Time'
				)},DATEADD(MINUTE,DATEPART(MINUTE, [End Time]),a.[Schedule Start Date]))
        END AS endDate
        ,DATEADD(HOUR,DATEPART(HOUR, [Start Time]) -${dateTimeUtil.getOffset(
			'[Schedule Start Date]',
			'AUS Eastern Standard Time'
		)},DATEADD(MINUTE,DATEPART(MINUTE, [Start Time]),a.[Schedule Start Date])) as startDate
        ,CONCAT(
                CASE 
                WHEN ([RecurringWeek] IS NOT NULL ) THEN CONCAT('FREQ=WEEKLY', ';INTERVAL=',RecurringWeek)
                WHEN ([RecurringWeek] IS NULL AND [Fortnightly] = 0 AND [Fortnightly] = 0 ) THEN CONCAT('FREQ=WEEKLY', ';INTERVAL=1')

                END, 
                CASE 
                    WHEN ([WeekDay]=2) THEN ';BYDAY=MO'
                    WHEN ([WeekDay]=3) THEN ';BYDAY=TU'
                    WHEN ([WeekDay]=4) THEN ';BYDAY=WE'
                    WHEN ([WeekDay]=5) THEN ';BYDAY=TH'
                    WHEN ([WeekDay]=6) THEN ';BYDAY=FR'
                    WHEN ([WeekDay]=7) THEN ';BYDAY=SA'
                    WHEN ([WeekDay]=8) THEN ';BYDAY=SU'
                END
                
                ) AS recurrenceRule
            FROM [dbo].[Clients Schedule] a
            LEFT JOIN [dbo].[Clients Tasks] b ON a.[Client Task Seq No] = b.[Client Task Seq No]
            LEFT JOIN [dbo].[Tasks] c ON b.[Task ID] = c.ID
            LEFT JOIN [dbo].[Ref Pricing Groups] d ON a.PricingGroupNo = d.PricingGroupNo
            WHERE ([Task Name] IS NOT NULL AND [Task Name] != 'X_UN')
            AND ((a.[Schedule Start Date] >=@Start  AND a.[Schedule Finish Date] <=@End)
            OR ((a.[Schedule Finish Date] >=@End OR a.[Schedule Finish Date] IS NULL) AND (a.[Schedule Start Date] <=@End AND a.[Schedule Start Date] > @Start ))
            OR (a.[Schedule Start Date] <=@Start AND (a.[Schedule Finish Date] >=@Start AND a.[Schedule Finish Date] < @End))
            OR (a.[Schedule Start Date] <=@Start AND a.[Schedule Finish Date] IS NULL))`;
		// }

		// if (viewStyle == 'table') {

		// }

		if (clientId !== null) query += `\nAND a.[Client ID]  = ` + clientId;
		if (carerId !== null) query += `\nAND a.[Carer ID]  = ` + carerId;

		query += `\nORDER BY a.[Schedule Start Date], a.[Start Time];`;
	}

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.getStandardService = getStandardService;

async function getStdServiceDetails(user, id) {
	console.log('getBookingChargeDetails()');
	query =
		`SELECT [Client Schedule Seq No] as scheduleSeqNo
        ,a.[Client ID] as clientId
        ,[WeekDay] as weekDay
        ,(CASE
            WHEN ([WeekDay]=2) THEN 'Mon'
            WHEN ([WeekDay]=3) THEN 'Tue'
            WHEN ([WeekDay]=4) THEN 'Wed'
            WHEN ([WeekDay]=5) THEN 'Thu'
            WHEN ([WeekDay]=6) THEN 'Fri'
            WHEN ([WeekDay]=7) THEN 'Sat'
            WHEN ([WeekDay]=8) THEN 'Sun'
        END) as weekDateText
        ,[Schedule Start Date] as scheduleStartDate
        ,[Schedule Finish Date] as scheduleEndDate
        ,DATEADD(HOUR,-10,[Start Time]) as startTime
        ,DATEADD(HOUR,-10,[End Time]) as endTime
        ,LTRIM(RIGHT(CONVERT(VARCHAR(20), [Start Time], 100), 7)) as startTime2
        ,LTRIM(RIGHT(CONVERT(VARCHAR(20), [End Time], 100), 7)) as endTime2
        --,[Overnight] as overnight
        --,[Overnight Active] as overnightActive
        --,[24Hr] as [24Hr]
        ,[ShiftTypeNo] as shiftTypeId
        ,[Fortnightly] as fortnightly
        ,[Monthly] as monthly
        ,[WeekNo] as weekNo
        ,[RecurringWeek] as recurringWeek
        ,[Avoid Holidays] as avoidHolidays
        ,c.[Std Charge Per Hour] as stdChargePerHour
        ,[Std Charge Per Shift] as stdChargePerShift
        ,[Std Charge Per KM] as stdChargePerKM
        ,c.[Charge GST] as chargeGST
        ,[Carer ID] as carerId
        ,concat(e.[Last Name], ', ', e.[First Name]) as carerName
        ,[Location] as location
        ,[Chargeable Shifts] as chargeableShifts
        ,[Chargeable Hours] as chargeableHours
        ,[Chargeable KMs] as chargeableKMs
        ,[Pay Rate Per KM] as payRatePerKM
        ,a.[Duties] as duties
        ,a.[Comments] as comments
        ,a.[PricingGroupNo] as pricingGroupNo
        ,d.[PricingGroupName] as pricingGroupName
        ,[Booking Total Charge] as bookingTotalCharge
        ,[Booking Total GST] as bookingTotalGST
        ,[Payable Amount] as payableAmount
        ,RTRIM(c.[Task Name]) as taskCode
        ,c.Title as taskName
        ,c.ID as taskId
        ,RTRIM(c.[Task Name]) + ' (' + c.[Title] + ')' as text
        ,DATEADD(HOUR,DATEPART(HOUR, [Start Time]) -10,DATEADD(MINUTE,DATEPART(MINUTE, [Start Time]),a.[Schedule Start Date])) as startDate
        ,DATEADD(HOUR,DATEPART(HOUR, [End Time]) -10,DATEADD(MINUTE,DATEPART(MINUTE, [End Time]),a.[Schedule Start Date])) as endDate  
          FROM [dbo].[Clients Schedule] a
          LEFT JOIN [dbo].[Clients Tasks] b ON a.[Client Task Seq No] = b.[Client Task Seq No]
          LEFT JOIN [dbo].[Tasks] c ON b.[Task ID] = c.ID
          LEFT JOIN [dbo].[Ref Pricing Groups] d ON a.PricingGroupNo = d.PricingGroupNo
          LEFT JOIN [dbo].[Carers] e ON (a.[Carer ID] = e.[ID] AND e.[CompanyID] = ${user.companyId})
        WHERE [Client Schedule Seq No]=` + id;
	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.getStdServiceDetails = getStdServiceDetails;

async function getStdServiceFundings(user, id) {
	console.log('getStdServiceFundings()');
	query = ` SELECT 
    CASE 
    WHEN (G.Company IS NULL AND (F.[Last Name] + ', ' + F.[First Name]) IS NOT NULL) THEN F.[Last Name] + ', ' + F.[First Name]
    WHEN (G.Company IS NOT NULL AND (F.[Last Name] + ', ' + F.[First Name]) IS NULL) THEN G.Company
    ELSE 'N/A' 
    END AS invoiceTo
    , CONVERT(DECIMAL(10,2),B.[Percentage Charged]*100) AS chargedPercentage
    , D.PricingGroupName AS pricingGroupName
    , B.[ChargeStartDate] AS startDate
    , B.[ChargeFinishDate] AS finishDate
    FROM [dbo].[Clients Schedule] A
    LEFT JOIN [dbo].[Clients Schedule Funding] B  ON A.[Client Schedule Seq No] = B.[Client Schedule Seq No]
    LEFT JOIN [dbo].[Clients Charges Splits] C ON C.[ClientScheduleFundNo] = B.[ClientScheduleFundNo]
    LEFT JOIN [dbo].[Ref Pricing Groups] D ON C.PricingGroupNo = D.PricingGroupNo
    LEFT JOIN [dbo].[Clients] F ON C.[Invoice To Client ID] = F.[ID]
    LEFT JOIN [dbo].[Agencies] G ON C.[Invoice To Agency ID] = G.[ID]
    LEFT JOIN [dbo].[Carers] H ON (A.[Carer ID] = H.[ID] AND H.[CompanyID] = ${user.companyId})
    WHERE A.[Client Schedule Seq No] = ${id}`;
	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.getStdServiceFundings = getStdServiceFundings;

async function getStdServicePayments(user, id) {
	console.log('getStdServicePayments()');
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
    FROM [dbo].[Clients Schedule] A
    JOIN [dbo].[Clients Charges] B ON A.[Client Schedule Seq No] = B.[Client Schedule Seq No]
    LEFT JOIN [dbo].[Pay Rate Types] C ON B.PayRateTypeNo = C.PayRateTypeNo
    LEFT JOIN [dbo].[Ref Charge Rate Types] D ON B.ChargeTypeNo = D.ChargeTypeNo
    LEFT JOIN [dbo].[Ref Period Types] E ON E.PeriodTypeNo = C.PeriodTypeNo
    LEFT JOIN [dbo].[Carers] H ON (A.[Carer ID] = H.[ID] AND H.[CompanyID] = ${user.companyId})
	WHERE A.[Client Schedule Seq No] = ${id}`;
	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.getStdServicePayments = getStdServicePayments;

async function getStdServiceCharges(user, id) {
	console.log('getStdServiceCharges()');
	query = `  SELECT RPT.[PeriodTypeName] AS rateType
    , BCS.[Charge Rate Qty] AS chargeRateQty
    , BCS.[Charge Rate Shift] AS chargeRateShift
    , BCS.[Charge Rate Km] AS chargeRateKm
    , BCS.[Charge GST] AS chargeGST
    , BCS.[Total GST] AS totalGST
    , BCS.[Total Charge] AS totalChargeExGST
    , (BCS.[Total Charge]+ BCS.[Total GST]) AS totalCharge
    , CASE WHEN (BC.[Invoice To Agency ID] IS NULL AND BC.[Invoice To Client ID] IS NOT NULL) THEN C.[Last Name] + ', ' + C.[First Name]
    ELSE A.[Company] END AS invoiceToClientOrAgency
    , BCS.[ChargeStartDate] AS startDate
	, BCS.[ChargeFinishDate] AS finishDate
    FROM [dbo].[Clients Schedule] B
    LEFT JOIN [dbo].[Clients Charges] BC ON B.[Client Schedule Seq No] = BC.[Client Schedule Seq No]
    LEFT JOIN [dbo].[Pay Rate Types] PR ON BC.PayRateTypeNo = PR.PayRateTypeNo
    LEFT JOIN [dbo].[Clients Schedule Funding] BF  ON B.[Client Schedule Seq No] = BF.[Client Schedule Seq No]
    LEFT JOIN [dbo].[Clients Charges Splits] BCS ON BF.[ClientScheduleFundNo] = BCS.[ClientScheduleFundNo]
    LEFT JOIN [dbo].[Ref Pricing Groups] RPG ON BCS.PricingGroupNo = RPG.PricingGroupNo
    LEFT JOIN [dbo].[Ref Period Types] RPT ON RPT.PeriodTypeNo = PR.PeriodTypeNo
    LEFT JOIN [dbo].[Clients] C ON B.[Client ID] = C.[ID]
    LEFT JOIN [dbo].[Agencies] A ON BC.[Invoice To Agency ID] = A.[ID]
    LEFT JOIN [dbo].[Carers] D ON (B.[Carer ID] = D.[ID] AND D.[CompanyID] = ${user.companyId})
    WHERE B.[Client Schedule Seq No] = ${id}`;
	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.getStdServiceCharges = getStdServiceCharges;

async function getStdServiceClientCarerArrangement(user, id) {
	console.log('getStdServiceCharges()');
	query = `  SELECT RPT.[PeriodTypeName] AS rateType
    , BCS.[Charge Rate Qty] AS chargeRateQty
    , BCS.[Charge Rate Shift] AS chargeRateShift
    , BCS.[Charge Rate Km] AS chargeRateKm
    , BCS.[Charge GST] AS chargeGST
    , BCS.[Total GST] AS totalGST
    , BCS.[Total Charge] AS totalChargeExGST
    , (BCS.[Total Charge]+ BCS.[Total GST]) AS totalCharge
    , CASE WHEN (BC.[Invoice To Agency ID] IS NULL AND BC.[Invoice To Client ID] IS NOT NULL) THEN C.[Last Name] + ', ' + C.[First Name]
    ELSE A.[Company] END AS invoiceToClientOrAgency
    , BCS.[ChargeStartDate] AS startDate
	, BCS.[ChargeFinishDate] AS finishDate
    FROM [dbo].[Clients Schedule] B
    LEFT JOIN [dbo].[Clients Charges] BC ON B.[Client Schedule Seq No] = BC.[Client Schedule Seq No]
    LEFT JOIN [dbo].[Pay Rate Types] PR ON BC.PayRateTypeNo = PR.PayRateTypeNo
    LEFT JOIN [dbo].[Clients Schedule Funding] BF  ON B.[Client Schedule Seq No] = BF.[Client Schedule Seq No]
    LEFT JOIN [dbo].[Clients Charges Splits] BCS ON BF.[ClientScheduleFundNo] = BCS.[ClientScheduleFundNo]
    LEFT JOIN [dbo].[Ref Pricing Groups] RPG ON BCS.PricingGroupNo = RPG.PricingGroupNo
    LEFT JOIN [dbo].[Ref Period Types] RPT ON RPT.PeriodTypeNo = PR.PeriodTypeNo
    LEFT JOIN [dbo].[Clients] C ON B.[Client ID] = C.[ID]
    LEFT JOIN [dbo].[Agencies] A ON BC.[Invoice To Agency ID] = A.[ID]
    LEFT JOIN [dbo].[Carers] D ON (B.[Carer ID] = D.[ID] AND D.[CompanyID] = ${user.companyId})
    WHERE B.[Client Schedule Seq No] = ${id}`;
	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.getStdServiceClientCarerArrangement = getStdServiceClientCarerArrangement;


async function getMaxBookingDate(user, id) {
	console.log('getStdServiceMaxBookingDate(user, id)');
	query = ` SELECT MAX([Booking date]) FROM [dbo].[Bookings] A
    LEFT JOIN [dbo].[Clients] C ON (A.[Client ID] = C.[ID] AND C.[CompanyID] = ${user.companyId})
    WHERE A.[Client Schedule Seq No] = ${id}`;
	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.getMaxBookingDate = getMaxBookingDate;
