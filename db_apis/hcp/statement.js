const database = require('../../services/database.js');
const tools = require('../../utils/tools.js');

// Get HCP client information on a GET HTTP request
async function getStatementData(user, context) {
	//console.log('getStatementData(context) with ' + context.type);
	let query = '';

	if (context.type == 'client') {
		if (context.startDate !== 'undefined' && context.endDate !== 'undefined') {
			query +=
				`DECLARE @Start date ='` +
				context.startDate +
				`'
            DECLARE @End date ='` +
				context.endDate +
				`'
            SELECT
              [ID] AS ClientID,
              [First Name] AS FirstName,
              [Last Name] AS LastName,
              [Address] AS Address,
              [City] AS City,
              [ZIP/Postal Code] AS PostCode,
              [State/Province] AS State,
              [Date of Birth] AS DateOfBirth,
              --[SequelStartDate] AS SequelStartDate,
              [Service Start Date] AS ServiceStartDate,
              [Service Finish Date] AS ServiceFinishDate,
              [Deceased] AS Deceased,
              [Gender] AS Gender,
              [Job Ref] AS JobRef
			FROM [Clients] AS a
			JOIN [ClientHCP] AS b ON b.[ClientID] = a.[ID]
            --WHERE((
            --    (a.[Service Start Date] <=@Start AND a.[Service Finish Date] >= @Start)
            --    OR
            --    (a.[Service Start Date] <=@End AND a.[Service Finish Date] >= @End)
            --    OR
            --    (a.[Service Start Date] <=@Start AND a.[Service Finish Date] >=@End)
            --    OR
            --    (a.[Service Start Date] >=@Start AND a.[Service Finish Date] <=@End )
            --    )
			--	OR (a.[Service Finish Date] is NULL AND a.[Service Start Date] <=@End))
			WHERE b.StartDate <= @End AND (b.EndDate >= @Start OR b.EndDate IS NULL)
			AND a.[CompanyID] = ${user.companyId}`;
		}
		if (context.clientIds !== undefined) {
			if (context.clientIds instanceof Array) query += `\nAND a.[ID]  IN (` + clientSet(context.clientIds) + `)`;
			else query += `\nAND a.[ID] = ` + context.clientIds;
		}
		if (context.clientId !== undefined) {
			query += `\nAND a.ClientID = ` + context.clientId;
		}

		query += `\nORDER BY a.[ID]`;
	}

	if (context.type == 'hcp') {
		if (context.startDate !== 'undefined' && context.endDate !== 'undefined') {
			query +=
				`DECLARE @Start date ='` +
				context.startDate +
				`'
            DECLARE @End date ='` +
				context.endDate +
				`'
            SELECT * FROM dbo.ClientHCP as b
            JOIN dbo.HCPRate as a
            ON a.HCPLevelCode = b.HCPLevelCode
            WHERE(a.HCPStartDate <= @Start AND a.HCPEndDate >=@End)`;

			if (context.clientIds !== undefined) {
				if (context.clientIds instanceof Array)
					query += `\nAND b.ClientID  IN (` + clientSet(context.clientIds) + `)`;
				else query += `\nAND b.ClientID = ` + context.clientIds;
			}
			if (context.clientId !== undefined) {
				query += `\nAND a.ClientID = ` + context.clientId;
			}

			query += `\nORDER BY b.StartDate`;
		}
	}

	if (context.type == 'hcp-level') {
		if (context.month !== 'undefined' && context.year !== 'undefined') {
			query +=
				`DECLARE @month INT ='` +
				context.month +
				`'
            DECLARE @year INT ='` +
				context.year +
				`'
            SELECT * FROM
            (SELECT  *
            FROM [dbo].[ClientHCP]
            EXCEPT

            SELECT  *
            FROM [dbo].[ClientHCP]
            WHERE (Year(EndDate) < @year OR (Year(EndDate) = @year AND Month(EndDate) < @month))
            OR (Year(StartDate) > @year OR (Year(StartDate) = @year AND Month(StartDate) > @month))
            ) AS A`;

			if (context.clientIds !== undefined) {
				if (context.clientIds instanceof Array)
					query += `\nWHERE A.ClientID  IN (` + clientSet(context.clientIds) + `)`;
				else query += `\nWHERE A.ClientID = ` + context.clientIds;
			} else if (context.clientId !== undefined) {
				query += `\nWHERE a.ClientID = ` + context.clientId;
			}

			query += `\nORDER BY A.StartDate`;
		}
		// console.log(query);
	}

	if (context.type == 'mgmt-level') {
		if (context.month !== 'undefined' && context.year !== 'undefined') {
			query +=
				`DECLARE @month INT ='` +
				context.month +
				`'
            DECLARE @year INT ='` +
				context.year +
				`'
            SELECT * FROM
            (SELECT  *
            FROM [dbo].[ClientManagementLevel] AS a
            JOIN (SELECT [ManagementLevelID] AS LevelID, 
                [ManagementLevelTypeCode] AS Code FROM[dbo].[ManagementLevel]) AS b
            ON a.ManagementLevelID = b.LevelID
            EXCEPT

            SELECT  *
            FROM [dbo].[ClientManagementLevel] AS a
            JOIN (SELECT [ManagementLevelID] AS LevelID, 
                [ManagementLevelTypeCode] AS Code FROM[dbo].[ManagementLevel]) AS b
            ON a.ManagementLevelID = b.LevelID
            WHERE (Year(a.EndDate) < @year OR (Year(a.EndDate) = @year AND Month(a.EndDate) < @month))
            OR (Year(a.StartDate) > @year OR (Year(a.StartDate) = @year AND Month(a.StartDate) > @month))
            ) AS A`;

			if (context.clientIds !== undefined) {
				if (context.clientIds instanceof Array)
					query += `\nWHERE A.ClientID  IN (` + clientSet(context.clientIds) + `)`;
				else query += `\nWHERE A.ClientID = ` + context.clientIds;
			} else if (context.clientId !== undefined) {
				query += `\nWHERE a.ClientID = ` + context.clientId;
			}

			query += `\nORDER BY A.StartDate`;
		}
		// console.log(query);
	}

	if (context.type == 'admin') {
		if (context.startDate !== 'undefined' && context.endDate !== 'undefined') {
			query +=
				`DECLARE @Start date ='` +
				context.startDate +
				`'
            DECLARE @End date ='` +
				context.endDate +
				`'
            SELECT * FROM [dbo].[ClientAdminFee] AS a
            LEFT JOIN [dbo].[AdministrativeFee] AS b
            ON a.AdministrativeFeeID = b.AdministrativeFeeID
            WHERE((
                (a.[StartDate] <=@Start AND a.[EndDate] >= @Start)
                OR
                (a.[StartDate] <=@End AND a.[EndDate] >= @End)
                OR
                (a.[StartDate] <=@Start AND a.[EndDate] >=@End)
                OR
                (a.[StartDate] >=@Start AND a.[EndDate] <=@End )
                )
                OR (a.EndDate is NULL AND a.StartDate <=@End))`;
		}
		if (context.clientIds !== undefined) {
			query += `\nAND a.ClientID  IN (` + clientSet(context.clientIds) + `)`;
		}
		if (context.clientId !== undefined) {
			query += `\nAND a.ClientID = ` + context.clientId;
		}

		query += `\nORDER BY a.StartDate`;
	}

	if (context.type == 'mgmt') {
		if (context.startDate !== 'undefined' && context.endDate !== 'undefined') {
			query +=
				`DECLARE @Start date ='` +
				context.startDate +
				`'
            DECLARE @End date ='` +
				context.endDate +
				`'
            SELECT * FROM [dbo].[ClientManagementLevel] AS a
            LEFT JOIN [dbo].[ManagementLevel] AS b
            on a.[ManagementLevelID] = b.[ManagementLevelID]
            WHERE((
                (a.[StartDate] <=@Start AND a.[EndDate] >= @Start)
                OR
                (a.[StartDate] <=@End AND a.[EndDate] >= @End)
                OR
                (a.[StartDate] <=@Start AND a.[EndDate] >=@End)
                OR
                (a.[StartDate] >=@Start AND a.[EndDate] <=@End )
                )
                OR (a.EndDate is NULL AND a.StartDate <=@End))`;
		}
		if (context.clientIds !== undefined) {
			if (context.clientIds instanceof Array)
				query += `\nAND a.ClientID  IN (` + clientSet(context.clientIds) + `)`;
			else query += `\nAND a.ClientID = ` + context.clientIds;
		}
		if (context.clientId !== undefined) {
			query += `\nAND a.ClientID = ` + context.clientId;
		}

		query += `\nORDER BY a.StartDate`;
	}

	if (context.type == 'contribution') {
		if (context.startDate !== 'undefined' && context.endDate !== 'undefined') {
			query +=
				`DECLARE @Start date ='` +
				context.startDate +
				`'
            DECLARE @End date ='` +
				context.endDate +
				`'
            SELECT * FROM [dbo].[ClientContribution] AS a
			LEFT JOIN [dbo].[ClientContributionType] AS b
			ON a.ContributionTypeID = b.ContributionTypeID
            WHERE((
                (a.[StartDate] <=@Start AND a.[EndDate] >= @Start)
                OR
                (a.[StartDate] <=@End AND a.[EndDate] >= @End)
                OR
                (a.[StartDate] <=@Start AND a.[EndDate] >=@End)
                OR
                (a.[StartDate] >=@Start AND a.[EndDate] <=@End )
                )
                OR (a.EndDate is NULL AND a.StartDate <=@End))`;
		}
		if (context.clientIds !== undefined) {
			if (context.clientIds instanceof Array)
				query += `\nAND a.ClientID  IN (` + clientSet(context.clientIds) + `)`;
			else query += `\nAND a.ClientID = ` + context.clientIds;
		}
		if (context.clientId !== undefined) {
			query += `\nAND a.ClientID = ` + context.clientId;
		}
		query += `\nORDER BY a.StartDate`;
	}

	if (context.type == 'supp') {
		if (context.startDate !== 'undefined' && context.endDate !== 'undefined') {
			query +=
				`DECLARE @Start date ='` +
				context.startDate +
				`'
            DECLARE @End date ='` +
				context.endDate +
				`'
            SELECT * FROM [dbo].[ClientSupplement] AS a
            JOIN  [dbo].[Supplement] AS b ON a.SuppID = b.SuppID
            JOIN  [dbo].[SuppRate] AS c ON a.SuppID= c.SuppID
            WHERE(c.SuppStartDate <= @Start AND c.SuppEndDate >=@End) 
            AND c.HCPLevelCode =
            (select HCPLevelCode from [dbo].[ClientHCP]
                WHERE  ClientID = a.ClientID  AND (EndDate IS NULL OR  EndDate >= @End OR (EndDate <= @End AND  EndDate >= @Start))
            )
            AND ((
                (a.[StartDate] <=@Start AND a.[EndDate] >= @Start)
                OR
                (a.[StartDate] <=@End AND a.[EndDate] >= @End)
                OR
                (a.[StartDate] <=@Start AND a.[EndDate] >=@End)
                OR
                (a.[StartDate] >=@Start AND a.[EndDate] <=@End )
                )
                OR (a.EndDate is NULL AND a.StartDate <=@End))`;
		}
		if (context.clientIds !== undefined) {
			if (context.clientIds instanceof Array)
				query += `\nAND a.ClientID  IN (` + clientSet(context.clientIds) + `)`;
			else query += `\nAND a.ClientID = ` + context.clientIds;
		}
		if (context.clientId !== undefined) {
			query += `\nAND a.ClientID = ` + context.clientId;
		}
		query += `\nORDER BY a.StartDate`;
	}

	if (context.type == 'leavebooking') {
		if (context.startDate !== 'undefined' && context.endDate !== 'undefined') {
			query +=
				`DECLARE @Start date ='` +
				context.startDate +
				`'
            DECLARE @End date ='` +
				context.endDate +
				`'
            
            SELECT * FROM [dbo].[ClientLeaveBooking] AS a
            LEFT JOIN [dbo].[LeaveType] AS e
            ON a.LeaveTypeID = e.LeaveTypeID
            LEFT JOIN [dbo].[LeaveCalcMode] AS f
            ON e.LeaveCalcModeID = f.LeaveCalcModeID
            WHERE(
            (a.[StartDate] <=@Start AND @Start <=a.[EndDate])
            OR
            (a.[StartDate] <=@End AND @End <=a.[EndDate])
            OR
            (a.[StartDate] <=@Start AND a.[EndDate] >=@End)
            OR
            (a.[StartDate] >@Start AND a.[EndDate] <@End )
            )`;
		}
		if (context.clientIds !== undefined) {
			if (context.clientIds instanceof Array)
				query += `\nAND a.ClientID  IN (` + clientSet(context.clientIds) + `)`;
			else query += `\nAND a.ClientID = ` + context.clientIds;
		}
		if (context.clientId !== undefined) {
			query += `\nAND a.ClientID = ` + context.clientId;
		}
		query += `\nORDER BY a.ClientID`;
	}

	if (context.type == 'leave-exceed-quota') {
		if (context.startDate !== 'undefined' && context.endDate !== 'undefined') {
			query +=
				`DECLARE @Start date ='` +
				context.startDate +
				`'
            DECLARE @End date ='` +
				context.endDate +
				`'
            
            SELECT * FROM
            (SELECT ClientID, ExceedTempStartDate, DATEADD (day , - LeaveRemaining -1 , ExceedTempStartDate ) AS ExceedTempEndDate
            FROM [dbo].[ClientLeaveBooking]
            WHERE ExceedTempStartDate is not null
            EXCEPT
            SELECT ClientID, ExceedTempStartDate, DATEADD (day , - LeaveRemaining -1 , ExceedTempStartDate ) AS ExceedTempEndDate
            FROM [dbo].[ClientLeaveBooking]
            WHERE ExceedTempStartDate is not null
            AND (@End < [StartDate] OR @Start > [EndDate])
            ) AS a `;
		}
		if (context.clientIds !== undefined) {
			if (context.clientIds instanceof Array)
				query += `\nWHERE a.ClientID  IN (` + clientSet(context.clientIds) + `)`;
			else query += `\nWHERE a.ClientID = ` + context.clientIds;
		} else if (context.clientId !== undefined) {
			query += `\nWHERE a.ClientID = ` + context.clientId;
		}
		query += `\nORDER BY a.ClientID`;
		// console.log(query);
	}

	if (context.type == 'purchases-service') {
		query += `SELECT * FROM [dbo].[SupplierInvoice] AS a
        LEFT JOIN [dbo].[Supplier] AS b
        ON a.[SupplierID] = b.[SupplierID]
        LEFT JOIN [dbo].[SupplierServiceBooking] AS c
        ON c.[SupplierServiceID] = a.[SupplierServiceID]
		LEFT JOIN [dbo].[Client] AS d
		ON c.[ClientID] = d.[ClientID]
        WHERE Amount > 0`;
		if (context.startDate !== 'undefined' && context.endDate !== 'undefined') {
			query += `\nAND InvoiceDate >= '` + context.startDate + `'`;
			query += `\nAND InvoiceDate <= '` + context.endDate + `'`;
		}
		if (context.startDate !== 'undefined' && context.endDate == 'undefined') {
			query += `\nAND InvoiceDate >= '` + context.startDate + `'`;
		}
		if (context.startDate == 'undefined' && context.endDate !== 'undefined') {
			query += `\nAND InvoiceDate <= '` + context.endDate + `'`;
		}
		if (context.clientIds !== undefined) {
			// query += `\nAND c.ClientID = ` + context.clientIds
			// query += `\nAND c.ClientID  IN (` + clientSet(context.clientIds) + `)`
			if (context.clientIds instanceof Array)
				query += `\nAND c.ClientID  IN (` + clientSet(context.clientIds) + `)`;
			else query += `\nAND c.ClientID = ` + context.clientIds;
		}
		if (context.clientId !== undefined) {
			query += `\nAND a.ClientID = ` + context.clientId;
		}
	}

	if (context.type == 'third-party-services') {
		query += `SELECT * FROM [dbo].[SupplierServices] AS a
        LEFT JOIN [dbo].[Supplier] AS b ON a.[SupplierID] = b.[SupplierID]
        --LEFT JOIN [dbo].[Clients] AS d ON a.[ClientID] = d.[ID]
        WHERE TotalAmount > 0`;
		if (context.startDate !== 'undefined' && context.endDate !== 'undefined') {
			query += `\nAND InvoiceDate >= '` + context.startDate + `'`;
			query += `\nAND InvoiceDate <= '` + context.endDate + `'`;
		}
		if (context.startDate !== 'undefined' && context.endDate == 'undefined') {
			query += `\nAND InvoiceDate >= '` + context.startDate + `'`;
		}
		if (context.startDate == 'undefined' && context.endDate !== 'undefined') {
			query += `\nAND InvoiceDate <= '` + context.endDate + `'`;
		}
		if (context.clientIds !== undefined) {
			if (context.clientIds instanceof Array)
				query += `\nAND a.ClientID  IN (` + clientSet(context.clientIds) + `)`;
			else query += `\nAND a.ClientID = ` + context.clientIds;
		}
		if (context.clientId !== undefined) {
			query += `\nAND a.ClientID = ` + context.clientId;
		}
	}

	if (context.type == 'adjustment') {
		query += `SELECT * FROM [dbo].[ClientAdjustmentBalance] AS a
            JOIN [dbo].[AdjustmentType]  AS b ON a.AdjustmentTypeID = b.AdjustmentTypeID `;
		if (context.startDate !== 'undefined' && context.endDate !== 'undefined') {
			query += `\nWHERE Date >= '` + context.startDate + `'`;
			query += `\nAND Date <= '` + context.endDate + `'`;
		}

		if (context.clientIds !== undefined) {
			if (context.clientIds instanceof Array)
				query += `\nAND ClientID  IN (` + clientSet(context.clientIds) + `)`;
			else query += `\nAND ClientID = ` + context.clientIds;
		}
		if (context.clientId !== undefined) {
			query += `\nAND a.ClientID = ` + context.clientId;
		}
		query += `\nORDER BY ClientID`;
	}

	// http://localhost:8000/api/hcp/report/leave-statement/2019-02-26/2019-02-28
	if (context.type == 'leave-statement') {
		if (context.startDate !== 'undefined' && context.endDate !== 'undefined') {
			query +=
				`DECLARE @Start date ='` +
				context.startDate +
				`'
        DECLARE @End date ='` +
				context.endDate +
				`'
        
        SELECT * FROM [dbo].[ClientLeaveBooking] AS a
        LEFT JOIN [dbo].[Client] AS b
        ON a.ClientID = b.ClientID
        LEFT JOIN [dbo].[ClientHCP] AS c
        ON b.ClientID = c.ClientID
        LEFT JOIN [dbo].[HCPLevel] AS d
        ON c.HCPLevelCode = d.HCPLevelCode
        LEFT JOIN [dbo].[LeaveType] AS e
        ON a.LeaveTypeID = e.LeaveTypeID
        LEFT JOIN [dbo].[LeaveCalcMode] AS f
        ON e.LeaveCalcModeID = f.LeaveCalcModeID
        WHERE
        (
        (a.[StartDate] <=@Start AND @Start <=a.[EndDate])
          OR
        (a.[StartDate] <=@End AND @End <=a.[EndDate])
          OR
        (a.[StartDate] <=@Start AND a.[EndDate] >=@End)
         OR
        (a.[StartDate] >@Start AND a.[EndDate] <@End ))
        AND (c.EndDate IS NULL)`;
		}

		if (context.startDate == 'undefined' && context.endDate == 'undefined') {
			query += `SELECT * FROM [dbo].[ClientLeaveBooking] AS a
            LEFT JOIN [dbo].[Client] AS b
            ON a.ClientID = b.ClientID
            LEFT JOIN [dbo].[ClientHCP] AS c
            ON b.ClientID = c.ClientID
            LEFT JOIN [dbo].[HCPLevel] AS d
            ON c.HCPLevelCode = d.HCPLevelCode
            LEFT JOIN [dbo].[LeaveType] AS e
            ON a.LeaveTypeID = e.LeaveTypeID     
            LEFT JOIN [dbo].[LeaveCalcMode] AS f
            ON e.LeaveCalcModeID = f.LeaveCalcModeID`;
		}
		if (context.startDate !== 'undefined' && context.endDate == 'undefined') {
			query +=
				`DECLARE @Start date ='` +
				context.startDate +
				`'        
        \nSELECT * FROM [dbo].[ClientLeaveBooking] AS a
        LEFT JOIN [dbo].[Client] AS b
        ON a.ClientID = b.ClientID
        LEFT JOIN [dbo].[ClientHCP] AS c
        ON b.ClientID = c.ClientID
        LEFT JOIN [dbo].[HCPLevel] AS d
        ON c.HCPLevelCode = d.HCPLevelCode
        LEFT JOIN [dbo].[LeaveType] AS e
        ON a.LeaveTypeID = e.LeaveTypeID
        LEFT JOIN [dbo].[LeaveCalcMode] AS f
        ON e.LeaveCalcModeID = f.LeaveCalcModeID  
       
        WHERE 
        (c.EndDate IS NULL OR c.EndDate >= @Start)
        AND
        (a.[StartDate] >=@Start OR a.[EndDate] >=@Start)`;
		}

		if (context.startDate == 'undefined' && context.endDate !== 'undefined') {
			query +=
				`DECLARE @End date ='` +
				context.endDate +
				`'
        \nSELECT * FROM [dbo].[ClientLeaveBooking] AS a
        LEFT JOIN [dbo].[Client] AS b
        ON a.ClientID = b.ClientID
        LEFT JOIN [dbo].[ClientHCP] AS c
        ON b.ClientID = c.ClientID
        LEFT JOIN [dbo].[HCPLevel] AS d
        ON c.HCPLevelCode = d.HCPLevelCode
        LEFT JOIN [dbo].[LeaveType] AS e
        ON a.LeaveTypeID = e.LeaveTypeID
        LEFT JOIN [dbo].[LeaveCalcMode] AS f
        ON e.LeaveCalcModeID = f.LeaveCalcModeID  
        
        WHERE 
        (c.EndDate IS NULL OR c.StartDate <= @End)
        AND
        (a.[StartDate]<=@End OR a.[EndDate] <=@End)`;
		}

		if (context.clientIds !== undefined) {
			// query += `\nAND a.ClientID = ` + context.clientIds
			// query += `\nAND a.ClientID  IN (` + clientSet(context.clientIds) + `)`

			if (context.clientIds instanceof Array)
				query += `\nAND a.ClientID  IN (` + clientSet(context.clientIds) + `)`;
			else query += `\nAND a.ClientID = ` + context.clientIds;
		}
		if (context.clientId !== undefined) {
			query += `\nAND a.ClientID = ` + context.clientId;
		}

		query += `\nORDER BY a.ClientID`;
	}

	if (context.type == 'leave-type-with-client-info') {
		query += `SELECT * FROM [dbo].[ClientLeaveQuota] as a
        LEFT JOIN [dbo].[LeaveType] AS b
        ON a.LeaveTypeID = b.LeaveTypeID
        LEFT JOIN [dbo].[Client] AS c
        ON a.ClientID = c.ClientID
        LEFT JOIN [dbo].[ClientHCP] AS d
        ON d.ClientID = a.ClientID
        LEFT JOIN [dbo].[HCPLevel] AS e
        ON d.HCPLevelCode = e.HCPLevelCode
        LEFT JOIN [dbo].[LeaveCalcMode] AS f
        ON b.LeaveCalcModeID = f.LeaveCalcModeID
        WHERE d.EndDate is null`;

		if (context.clientIds !== undefined) {
			// query += `\nAND a.ClientID = ` + context.clientIds
			// query += `\nAND a.ClientID  IN (` + clientSet(context.clientIds) + `)`

			if (context.clientIds instanceof Array)
				query += `\nAND a.ClientID  IN (` + clientSet(context.clientIds) + `)`;
			else query += `\nAND a.ClientID = ` + context.clientIds;
		}
		if (context.clientId !== undefined) {
			query += `\nAND a.ClientID = ` + context.clientId;
		}
	}

	//console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.getStatementData = getStatementData;

function clientSet(arr) {
	// console.log(arr);
	let id_arr = [];
	for (let item of arr) {
		if (item.ClientID != undefined) id_arr.push(item.ClientID);
	}
	return id_arr.join(',');
}

async function storeDailyStatementData(data) {
	console.log('storeDailyStatementData(data) - INSERT INTO  [dbo].[ClientDailyStatementData]');
	// let query = '';
	var values = [];
	// console.log(data);
	//  Start transaction
	let query = `BEGIN TRY
    BEGIN TRANSACTION ;
    SET IMPLICIT_TRANSACTIONS ON;\n`;

	data.forEach((item) => {
		valueSet1 = [
			item.ClientID,
			item.date,
			item.ratio,
			item.ratio == 0.25
				? (item.HCPAmount + item.incomeTestedFee) * item.ratio - item.incomeTestedFee
				: item.HCPAmount,
			item.MgmtRate,
			item.suppAmount,
			item.basicDailyFee,
			item.incomeTestedFee,
			item.thirdPartyServiceCost,
			item.adminRate,
			item.carerServiceCost,
			item.clientContributionAdjustAmount,
			item.govContributionAdjustAmount,
			item.clientExpenditureAdjustAmount,
		];

		valueSet2 = [ item.adminFeeAdjust, item.advisoryFeeAdjust, item.clientTransferAdjust, item.govTransferAdjust ];

		query +=
			`INSERT INTO  [dbo].[ClientDailyStatementData]` +
			`\nVALUES (` +
			tools.array2String(valueSet1) +
			`,GetDate(), ` +
			tools.array2String(valueSet2) +
			` )\n`;
	});

	// Commit the transaction
	query += `COMMIT
     END TRY
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
    END CATCH`;
	// console.log(query);

	const result = await database.simpleExecute(query);
	return result;
}
module.exports.storeDailyStatementData = storeDailyStatementData;

// Delete Old Statement Data in case of regeneration of Monthly Statement
async function deleteMonthlyStatement(context, data) {
	console.log('deleteMonthlyStatement(context,data)/[ClientMonthlyStatement] ');
	// console.log(context);

	let query = '';
	// console.log(data);
	if (data.clientIds === undefined) {
		// Delete all data of a specific month/year
		query += `DELETE A FROM [ClientMonthlyStatement] A
				JOIN [Clients] B ON B.[ID] = A.[ClientID]
				WHERE B.[CompanyID] = ${user.companyId}
				  AND A.[Month] = ${data.month}
				  AND A.[Year] = ${data.year};`;
	} else {
		data.clientIds.forEach((item) => {
			// For each client
			// Delete data for each client within specific month/year
			query += `DELETE A FROM [ClientMonthlyStatement] A
						JOIN [Clients] B ON B.[ID] = A.[ClientID]
						WHERE B.[CompanyID] = ${user.companyId}
						  AND A.[Month] = ${data.month}
						  AND A.[Year] = ${data.year}
						  AND A.[ClientID] = ${item.ClientID};`;
		});
	}
	// console.log(query);

	const result = await database.simpleExecute2(query);
	return result;
}
module.exports.deleteMonthlyStatement = deleteMonthlyStatement;

// Delete Old Statement Data in case of regeneration of Monthly Statement
async function deleteDailyStatement(user, data) {
	console.log('deleteDailyStatement(context,data)/[InboundTransaction][ClientDailyStatementData]');
	// console.log(context);

	let query = '';
	// console.log(data);
	if (data.clientIds === undefined) {
		// Delete all data of a specific month/year
		query += `DELETE A FROM [ClientDailyStatementData] A
					JOIN [Clients] B ON B.[ID] = A.[ClientID]
					WHERE B.[CompanyID] = ${user.companyId}
					  AND MONTH(A.[Date]) = ${data.month}
					  AND YEAR(A.[Date]) = ${data.year};`;

		query += `DELETE A FROM [InboundTransaction] A
				JOIN [Clients] B ON B.[ID] = A.[ClientID]
				WHERE B.[CompanyID] = ${user.companyId}
				  AND A.[Month] = ${data.month}
				  AND A.[Year] = ${data.year};`;

		query += `DELETE A FROM [OutboundTransaction] A
				  JOIN [Clients] B ON B.[ID] = A.[ClientID]
				  WHERE B.[CompanyID] = ${user.companyId}
					AND A.[Month] = ${data.month}
					AND A.[Year] = ${data.year};`;
	} else {
		data.clientIds.forEach((item) => {
			// For each client
			// Delete data for each client within specific month/year
			query += `DELETE A FROM [ClientDailyStatementData] A
						JOIN [Clients] B ON B.[ID] = A.[ClientID]
						WHERE B.[CompanyID] = ${user.companyId}
						  AND MONTH(A.[Date]) = ${data.month}
						  AND YEAR(A.[Date]) = ${data.year}
						  AND A.[ClientID] = ${item.ClientID};`;

			query += `DELETE A FROM [InboundTransaction] A
						JOIN [Clients] B ON B.[ID] = A.[ClientID]
						WHERE B.[CompanyID] = ${user.companyId}
						  AND A.[Month] = ${data.month}
						  AND A.[Year] = ${data.year}
						  AND A.[ClientID] = ${item.ClientID};`;

			query += `DELETE A FROM [OutboundTransaction] A
						JOIN [Clients] B ON B.[ID] = A.[ClientID]
						WHERE B.[CompanyID] = ${user.companyId}
						  AND A.[Month] = ${data.month}
						  AND A.[Year] = ${data.year}
						  AND A.[ClientID] = ${item.ClientID};`;
		});
	}

	console.log(query);

	const result = await database.simpleExecute(query);
	return result;
}
module.exports.deleteDailyStatement = deleteDailyStatement;

// Create a new client on a POST HTTP request
async function createInboundData(month, year, data) {
	console.log('createInboundData(month, year, data)/[InboundTransaction]');

	//  Start transaction
	let query = `BEGIN TRY
    BEGIN TRANSACTION ;
    SET IMPLICIT_TRANSACTIONS ON;\n`;

	query += `
        DECLARE @clientID INT =0
        DECLARE @month INT =0
        DECLARE @year INT =0
        DECLARE @govSubsidy DECIMAL(18,2) = 0.00
        DECLARE @suppSubsidy DECIMAL(18,2) = 0.00
        DECLARE @clientContribution DECIMAL(18,2) = 0.00
        DECLARE @serviceFee DECIMAL(18,2) = 0.00
        DECLARE @adminFee DECIMAL(18,2) = 0.00
        DECLARE @advisoryFee DECIMAL(18,2) = 0.00
        
        `;

	data.forEach((item) => {
		query += `SET @clientID = ${item.ClientID}
            SET @month = ${month}
			SET @year = ${year}
    
            SET @govSubsidy =  (SELECT sum(HCPAmount)
            FROM [dbo].[ClientDailyStatementData]
            WHERE ClientID = @clientID
            AND MONTH ([Date])=@month
            AND YEAR ([Date])=@year)

            SET @suppSubsidy = (SELECT sum(SuppAmount)
            FROM [dbo].[ClientDailyStatementData]
            WHERE ClientID = @clientID
            AND MONTH ([Date])=@month
            AND YEAR ([Date])=@year)

            SET @clientContribution = (SELECT ROUND(sum(IncomeTestedFee),2) + ROUND(sum(BasicDailyFee),2)
            FROM [dbo].[ClientDailyStatementData]
            WHERE ClientID = @clientID
            AND MONTH ([Date])=@month
            AND YEAR ([Date])=@year)

            SET @serviceFee = (SELECT ROUND(sum(CarerServiceCost),2) + ROUND(sum(ThirdPartyServiceCost),2)
            FROM [dbo].[ClientDailyStatementData]
            WHERE ClientID = @clientID
            AND MONTH ([Date])=@month
            AND YEAR ([Date])=@year)

            SET @adminFee = (SELECT SUM(adminFee) FROM (
                SELECT  AdminRate*(ROUND(sum(HCPAmount),2) + ROUND(sum(BasicDailyFee),2) + ROUND(sum(IncomeTestedFee),2)) AS adminFee
                FROM [dbo].[ClientDailyStatementData] 
                WHERE ClientID = @clientID
                AND MONTH ([Date])=@month
                AND YEAR ([Date])=@year
                GROUP BY HCPAmount, BasicDailyFee, IncomeTestedFee, AdminRate) AS a)

            SET @advisoryFee = (SELECT SUM(advisoryFee) FROM (
                SELECT MgmtRate*(ROUND(sum(HCPAmount),2) + ROUND(sum(BasicDailyFee),2) + ROUND(sum(IncomeTestedFee),2)) AS advisoryFee
                FROM [dbo].[ClientDailyStatementData] 
                WHERE ClientID = @clientID
                AND MONTH ([Date])=@month
                AND YEAR ([Date])=@year
                GROUP BY HCPAmount, BasicDailyFee, IncomeTestedFee, MgmtRate) AS a)


            INSERT INTO [dbo].[InboundTransaction] VALUES(1, @clientID,  @month, @year, @govSubsidy,0,null,@govSubsidy,GetDate());
            INSERT INTO [dbo].[InboundTransaction] VALUES(2, @clientID, @month, @year, @clientContribution,0,null,@clientContribution,GetDate());
            INSERT INTO [dbo].[InboundTransaction] VALUES(3, @clientID, @month, @year, @suppSubsidy,0,null,@suppSubsidy,GetDate());

            INSERT INTO [dbo].[OutboundTransaction] VALUES(@month, @year, @clientID, 1,  @serviceFee,GetDate());
            INSERT INTO [dbo].[OutboundTransaction] VALUES(@month, @year, @clientID, 2,  @adminFee,GetDate());
            INSERT INTO [dbo].[OutboundTransaction] VALUES(@month, @year, @clientID, 3,  @advisoryFee,GetDate());
            `;
	});

	// Commit the transaction
	query += `COMMIT
    END TRY
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
   END CATCH`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result;
}

module.exports.createInboundData = createInboundData;

async function getCarerData(user, context) {
	console.log('getCarerData(context)/[vwBookingsChargesDetails]');

	let query = '';
	if (context.startDate !== 'undefined' && context.endDate !== 'undefined') {
		query +=
			`DECLARE @Start date ='` +
			context.startDate +
			`'
            DECLARE @End date ='` +
			context.endDate +
			`'
            SELECT * FROM [dbo].[vwBookingsChargesDetails] AS a
            WHERE(a.[Booking Date] >=@Start AND a.[Booking Date] <=@End)
            AND a.[Cancel Charges]=0
            AND a.[Booking Total Charge]!=0.00
            AND LOWER(a.[Job Ref]) LIKE '%sequel%'`;
	}
	if (context.clientIds !== undefined) {
		if (context.clientIds instanceof Array)
			query += `\nAND a.[Client ID] IN (` + clientSet(context.clientIds) + `)`;
		else query += `\nAND a.[Client ID] = ` + context.clientIds;
	}
	if (context.clientId !== undefined) {
		query += `\nAND a.[Client ID] = ` + context.clientId;
	}
	query += `\nORDER BY a.[Client ID], a.[Booking Date];`;

	// console.log(query)
	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.getCarerData = getCarerData;

async function carerServiceCost(user, clientId, date) {
	console.log('DB:statement.carerServiceCost(user, clientId, date)');

	let query = `SELECT
				SUM(
					ISNULL(B.[Hours Charged], 0) * ISNULL(B.[Charge Rate Qty], 0) + 
					ISNULL(B.[Shifts Charged], 0) * ISNULL(B.[Charge Per Shift], 0) + 
					ISNULL(B.[KMs Charged], 0) * ISNULL(B.[Charge Per KM], 0)
				) as carerServiceCost
				FROM vwBookingsChargesDetails B
				WHERE B.[CompanyID] = ${user.companyId}
				AND B.[Client ID] = ${clientId}
				AND B.[Booking Date] = '${date}'
				AND B.[Cancel Charges] = 0
				AND B.[Booking Total Charge] != 0.0
				AND LOWER(B.[Job Ref]) LIKE '%sequel%'`;

	console.log(query);
	const result = await database.simpleExecute(query);

	if (result.recordset.length > 0 && result.recordset[0].carerServiceCost != null)
		return result.recordset[0].carerServiceCost;

	return 0;
}
module.exports.carerServiceCost = carerServiceCost;

// async function getThirdPartyServices(context) {
//     console.log("getThirdPartyServices(context)/[SupplierServiceBooking][SupplierInvoiceItem]");
//     console.log(context);

//     let query = '';
//     if (context.startDate !== 'undefined' && context.endDate !== 'undefined') {
//         query +=
//             `DECLARE @Start date ='` + context.startDate + `'
//             DECLARE @End date ='` + context.endDate + `'

//             SELECT a.StartDate, a.ServiceDescription, c.InvoiceDate, 1 AS Unit,
// 			(SELECT sum(b.ItemAmount) FROM [dbo].[SupplierInvoiceItem] AS b WHERE a.SupplierServiceID = b.SupplierServiceID) as Amount
//             FROM [dbo].[SupplierServiceBooking] AS a
// 			JOIN SupplierInvoice AS c ON c.SupplierServiceID = a.SupplierServiceID
//             WHERE(c.[InvoiceDate]>=@Start AND c.[InvoiceDate]<=@End)`;

//     }
//     if (context.id !== undefined) {
//         query += `\nAND a.[ClientID] = ` + context.id
//     }
//     query += `\nORDER BY c.[InvoiceDate];`

//     // console.log(query);
//     const result = await database.simpleExecute2(query);
//     return result.recordset;
// }

// module.exports.getThirdPartyServices = getThirdPartyServices;

async function getThirdPartyServices(context) {
	console.log('getThirdPartyServices(context)/[SupplierServices]');
	// console.log(context);

	let query = '';
	if (context.startDate !== 'undefined' && context.endDate !== 'undefined') {
		query +=
			`DECLARE @Start date ='` +
			context.startDate +
			`'
            DECLARE @End date ='` +
			context.endDate +
			`'

            SELECT ServiceDescription, SupplierName,InvoiceDate, 1 AS Unit, TotalAmount as Amount
            FROM [dbo].[SupplierServices] AS a
            JOIN [dbo].[Supplier] AS b ON a.[SupplierID] = b.[SupplierID]
            WHERE([InvoiceDate]>=@Start AND [InvoiceDate]<=@End)`;
	}
	if (context.clientId !== undefined) {
		query += `\nAND [ClientID] = ` + context.clientId;
	}
	query += `\nORDER BY [InvoiceDate];`;

	// console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.getThirdPartyServices = getThirdPartyServices;

async function getMonthlyIncomeTestedFee(context) {
	console.log('getMonthlyIncomeTestedFee(context)/[ClientDailyStatementData]');
	// console.log(context);

	let query = '';
	if (context.startDate !== 'undefined' && context.endDate !== 'undefined') {
		query +=
			`DECLARE @Start date ='` +
			context.startDate +
			`'
            DECLARE @End date ='` +
			context.endDate +
			`'

            SELECT IncomeTestedFee, count(*) AS NumOfDays
            FROM [dbo].[ClientDailyStatementData]
            WHERE([Date]>=@Start AND [Date]<=@End)
            AND IncomeTestedFee >0`;
	}
	if (context.clientId !== undefined) {
		query += `\nAND [ClientID] = ` + context.clientId;
	}
	query += `\nGROUP BY [IncomeTestedFee];`;

	// console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.getMonthlyIncomeTestedFee = getMonthlyIncomeTestedFee;

async function getLeaveSummaryData(context) {
	console.log('getLeaveSummaryData(context)/[ClientLeaveQuota][LeaveType]');

	let query = '';
	if (context.startDate !== 'undefined' && context.endDate !== 'undefined') {
		query +=
			`DECLARE @Start date ='` +
			context.startDate +
			`'
            DECLARE @End date ='` +
			context.endDate +
			`'
            
            SELECT *
            FROM [dbo].[ClientLeaveQuota] AS a
            JOIN [dbo].[LeaveType] AS b
            ON a.LeaveTypeID = b.LeaveTypeID
            JOIN [dbo].[LeaveCalcMode] AS c
            ON b.LeaveCalcModeID = c.LeaveCalcModeID
            WHERE a.StartDate <= @Start AND a.EndDate >= @End`;
	}
	if (context.clientId !== undefined) {
		query += `\nAND a.[ClientID] = ` + context.clientId;
	}
	query += `\nORDER BY a.LeaveTypeID;`;

	// console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.getLeaveSummaryData = getLeaveSummaryData;

async function getLeaveSummaryPeriod(context) {
	console.log('getLeaveSummaryPeriod(context)/[ClientLeaveQuota][LeaveType]');

	let query = '';
	if (context.startDate !== 'undefined' && context.endDate !== 'undefined' && context.clientId !== undefined) {
		query +=
			`DECLARE @Start date ='` +
			context.startDate +
			`'
            DECLARE @End date ='` +
			context.endDate +
			`'
            DECLARE @ClientID INT =` +
			context.clientId +
			`

            SELECT b.LeaveTypeID, b.[LeaveTypeName], b.[LeaveQuota], b.[LeaveTypeCode], b.LeaveCalcModeName, b.LeaveCalcModeCode,  sum(b.CurrentLeaveTaken) as LeaveTaken FROM
            (Select *,  DATEDIFF(day,[StartDate],[EndDate]) + 1 as CurrentLeaveTaken, a.[StartDate] as CurrentStartDate, a.[EndDate] as CurrentEndDate from ClientLeaveBooking as a
            JOIN (select LeaveTypeID as id, [LeaveTypeName], [LeaveQuota], [LeaveTypeCode], LeaveCalcModeName, LeaveCalcModeCode from [dbo].[LeaveType] AS c1
					JOIN [dbo].[LeaveCalcMode] AS c2 ON c1.LeaveCalcModeID = c2.LeaveCalcModeID) as d ON a.LeaveTypeID = d.id
            WHERE ([StartDate] >= @Start AND [EndDate] <= @End)
            AND a.[ClientID] =@ClientID
            UNION
            Select *,  DATEDIFF(day,@Start,[EndDate]) + 1 as CurrentLeaveTaken, @Start as CurrentStartDate, a.[EndDate] as CurrentEndDate from ClientLeaveBooking as a
            JOIN (select LeaveTypeID as id, [LeaveTypeName], [LeaveQuota], [LeaveTypeCode], LeaveCalcModeName, LeaveCalcModeCode from [dbo].[LeaveType] AS c1
					JOIN [dbo].[LeaveCalcMode] AS c2 ON c1.LeaveCalcModeID = c2.LeaveCalcModeID) as d ON a.LeaveTypeID = d.id
            WHERE ([StartDate] < @Start AND ([EndDate] >= @Start AND [EndDate] <= @End))
            AND a.[ClientID] =@ClientID
            UNION
            Select *,  DATEDIFF(day,[StartDate],@End) + 1 as CurrentLeaveTaken, a.[StartDate] as CurrentStartDate, @End as CurrentEndDate from ClientLeaveBooking as a
            JOIN (select LeaveTypeID as id, [LeaveTypeName], [LeaveQuota], [LeaveTypeCode], LeaveCalcModeName, LeaveCalcModeCode from [dbo].[LeaveType] AS c1
					JOIN [dbo].[LeaveCalcMode] AS c2 ON c1.LeaveCalcModeID = c2.LeaveCalcModeID) as d ON a.LeaveTypeID = d.id
            WHERE (([StartDate] >= @Start AND [StartDate] <= @End) AND [EndDate] > @End)
            AND a.[ClientID] =@ClientID
            UNION
            Select *,  DATEDIFF(day,@Start,@End) + 1 as CurrentLeaveTaken, a.[StartDate] as CurrentStartDate, a.[EndDate] as CurrentEndDate from ClientLeaveBooking as a
            JOIN (select LeaveTypeID as id, [LeaveTypeName], [LeaveQuota], [LeaveTypeCode], LeaveCalcModeName, LeaveCalcModeCode from [dbo].[LeaveType] AS c1
					JOIN [dbo].[LeaveCalcMode] AS c2 ON c1.LeaveCalcModeID = c2.LeaveCalcModeID) as d ON a.LeaveTypeID = d.id
            WHERE ([StartDate] < @Start AND [EndDate] > @End)
            AND a.[ClientID] =@ClientID) AS b
            GROUP BY b.LeaveTypeID, b.[LeaveTypeName], b.[LeaveQuota], b.[LeaveTypeCode], b.LeaveCalcModeName, b.LeaveCalcModeCode
            ORDER BY b.LeaveTypeID;
            `;
	}

	// console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.getLeaveSummaryPeriod = getLeaveSummaryPeriod;

async function getLeaveDetailsData(context) {
	console.log('getLeaveDetailsData(context)/[LeaveTypeName][LeaveType][ClientLeaveBooking]');
	let query = '';

	if (context.startDate !== 'undefined' && context.endDate !== 'undefined' && context.clientId !== 'undefined') {
		query +=
			`DECLARE @month INT =` +
			context.month +
			`
            DECLARE @year INT =` +
			context.year +
			`
            DECLARE @Start date ='` +
			context.startDate +
			`'
            DECLARE @End date ='` +
			context.endDate +
			`'
            DECLARE @ClientID INT =` +
			context.clientId +
			`

            SELECT * FROM 
            (Select *,  DATEDIFF(day,[StartDate],[EndDate]) + 1 as CurrentLeaveTaken, a.[StartDate] as CurrentStartDate, a.[EndDate] as CurrentEndDate from ClientLeaveBooking as a
            JOIN (select LeaveTypeID as id, [LeaveTypeName] from [dbo].[LeaveType]) as d
			ON a.LeaveTypeID = d.id
            WHERE ([StartDate] >= @Start AND [EndDate] <= @End)
            AND a.[ClientID] =@ClientID
            UNION
            Select *,  DATEDIFF(day,@Start,[EndDate]) + 1 as CurrentLeaveTaken, @Start as CurrentStartDate, a.[EndDate] as CurrentEndDate from ClientLeaveBooking as a
            JOIN (select LeaveTypeID as id, [LeaveTypeName] from [dbo].[LeaveType]) as d
			ON a.LeaveTypeID = d.id
            WHERE ([StartDate] < @Start AND ([EndDate] >= @Start AND [EndDate] <= @End))
            AND a.[ClientID] =@ClientID
            UNION
            Select *,  DATEDIFF(day,[StartDate],@End) + 1 as CurrentLeaveTaken, a.[StartDate] as CurrentStartDate, @End as CurrentEndDate from ClientLeaveBooking as a
            JOIN (select LeaveTypeID as id, [LeaveTypeName] from [dbo].[LeaveType]) as d
			ON a.LeaveTypeID = d.id
            WHERE (([StartDate] >= @Start AND [StartDate] <= @End) AND [EndDate] > @End)
            AND a.[ClientID] =@ClientID
            UNION
            Select *,  DATEDIFF(day,@Start,@End) + 1 as CurrentLeaveTaken, a.[StartDate] as CurrentStartDate, a.[EndDate] as CurrentEndDate from ClientLeaveBooking as a
            JOIN (select LeaveTypeID as id, [LeaveTypeName] from [dbo].[LeaveType]) as d
			ON a.LeaveTypeID = d.id
            WHERE ([StartDate] < @Start AND [EndDate] > @End)
            AND a.[ClientID] =@ClientID) AS b
            ORDER BY b.[StartDate]
            `;
	}

	// console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.getLeaveDetailsData = getLeaveDetailsData;

// async function getLeaveDetailsData(context) {
//     console.log("getLeaveDetailsData(context)/[LeaveTypeName][LeaveType][ClientLeaveBooking]");
//     let query = '';

//     if (context.startDate !== 'undefined' && context.endDate !== 'undefined' && context.id !== 'undefined') {
//         query +=
//             `DECLARE @month INT =` + context.month + `
//             DECLARE @year INT =` + context.year + `
//             DECLARE @Start date ='` + context.startDate + `'
//             DECLARE @End date ='` + context.endDate + `'

//             SELECT * FROM
//             (Select *,  DATEDIFF(day,[StartDate],[EndDate]) + 1 as CurrentLeaveTaken, a.[StartDate] as CurrentStartDate, a.[EndDate] as CurrentEndDate from ClientLeaveBooking as a
//             JOIN (select LeaveTypeID as id, [LeaveTypeName] from [dbo].[LeaveType]) as d
// 			ON a.LeaveTypeID = d.id
//             WHERE  YEAR([EndDate])=@year AND (MONTH([StartDate]) = @month AND MONTH([EndDate]) =@month)
//             AND a.[ClientID] =` + context.id +`
//             UNION
//             Select *,  DATEDIFF(day,[StartDate],@End) + 1 as CurrentLeaveTaken, a.[StartDate] as CurrentStartDate, @End as CurrentEndDate from ClientLeaveBooking as a
//             JOIN (select LeaveTypeID as id, [LeaveTypeName] from [dbo].[LeaveType]) as d
// 			ON a.LeaveTypeID = d.id
//             WHERE  YEAR([EndDate])=@year AND (MONTH([StartDate]) = @month AND MONTH([EndDate]) >@month)
//             AND a.[ClientID] =` + context.id +`
//             UNION
//             Select *,  DATEDIFF(day,@Start,@End) + 1 as CurrentLeaveTaken, a.[StartDate] as CurrentStartDate, a.[EndDate] as CurrentEndDate from ClientLeaveBooking as a
//             JOIN (select LeaveTypeID as id, [LeaveTypeName] from [dbo].[LeaveType]) as d
// 			ON a.LeaveTypeID = d.id
//             WHERE  YEAR([EndDate])=@year AND ([StartDate] < @Start AND [EndDate] is null)
//             AND a.[ClientID] =` + context.id + `) AS b
//             ORDER BY b.[StartDate]
//             `;
//     }

//     // console.log(query);
//     const result = await database.simpleExecute2(query);
//     return result.recordset;
// }

// module.exports.getLeaveDetailsData = getLeaveDetailsData;

// async function getLeaveDetailsData(context) {
//     console.log("getLeaveDetailsData(context)/[LeaveTypeName][LeaveType][ClientLeaveBooking]");
//     let query = '';

//     if (context.startDate !== 'undefined' && context.endDate !== 'undefined' && context.id !== 'undefined') {
//         query +=
//             `DECLARE @month INT =` + context.month + `
//             DECLARE @year INT =` + context.year + `
//             DECLARE @Start date ='` + context.startDate + `'
//             DECLARE @End date ='` + context.endDate + `'
//             DECLARE @ClientID INT ='` + context.id + `'

//             SELECT * FROM [dbo].[ClientLeaveBooking]
//             WHERE (YEAR([StartDate])=@year AND YEAR([EndDate])=@year)
//             AND (MONTH([StartDate]) = @month AND MONTH([EndDate]) =@month)
//             AND [ClientID] = @ClientID
//             ORDER BY [StartDate]
//             `;
//     }

//     // console.log(query);
//     const result = await database.simpleExecute2(query);
//     return result.recordset;
// }

// module.exports.getLeaveDetailsData = getLeaveDetailsData;

async function getLeaveQuotaNotInRange(context) {
	console.log('getLeaveQuotaNotInRange(context)/[ClientLeaveBooking]');
	let query = '';
	if (context.startDate !== 'undefined' && context.endDate !== 'undefined') {
		query +=
			`DECLARE @month INT = ` +
			context.month +
			`
            DECLARE @year INT = ` +
			context.year +
			`
            DECLARE @Start date  = '` +
			context.startDate +
			`'
            DECLARE @End date  = '` +
			context.endDate +
			`'
            DECLARE @leaveTypeID INT = 1
            DECLARE @QuotaNotInRange INT  = 0
            DECLARE @QuotaOverlapRange INT  = 0
            DECLARE @QuotaNoEndDate INT  = 0 
            DECLARE @QuotaReturnTbl TABLE (num INT)

            WHILE @leaveTypeID < 5
            BEGIN
            SET @QuotaOverlapRange =  (SELECT sum(DATEDIFF(day,@End,[EndDate])) FROM ClientLeaveBooking as a
                         WHERE  (YEAR([EndDate])=@year AND (MONTH([StartDate]) = @month AND MONTH([EndDate]) >@month))
             AND [LeaveTypeID] = @leaveTypeID)

             SET @QuotaNoEndDate =  (SELECT sum(DATEDIFF(day,@Start,[EndDate])) FROM ClientLeaveBooking as a
                         WHERE  (YEAR([StartDate])=@year AND [EndDate] is NULL)
             AND [LeaveTypeID] = @leaveTypeID)

             SET @QuotaNotInRange =  (SELECT sum(DATEDIFF(day,[StartDate],[EndDate])+1) FROM ClientLeaveBooking as a
                         WHERE  ((YEAR([EndDate])=@year AND (MONTH([StartDate]) > @month AND MONTH([EndDate]) >@month))
                         OR  YEAR([StartDate]) > @year)
             AND [LeaveTypeID] = @leaveTypeID)

			 IF (@QuotaOverlapRange IS NULL) SET @QuotaOverlapRange =0
             IF (@QuotaNotInRange IS NULL) SET @QuotaNotInRange =0
             IF (@QuotaNoEndDate IS NULL) SET @QuotaNoEndDate =0

             INSERT INTO @QuotaReturnTbl VALUES(@QuotaOverlapRange + @QuotaNotInRange-@QuotaNoEndDate)

             SET @leaveTypeID = @leaveTypeID + 1;
            END;

            SELECT * FROM @QuotaReturnTbl `;
	}

	// console.log(query)
	const result = await database.simpleExecute2(query);
	return result.recordset;
}

module.exports.getLeaveQuotaNotInRange = getLeaveQuotaNotInRange;

async function retrieveStatementData(user, context) {
	console.log('retrieveStatementData(context)/[ClientDailyStatementData]');
	let query = '';
	if (context.startDate !== 'undefined' && context.endDate !== 'undefined') {
		query +=
			`DECLARE @Start date ='` +
			context.startDate +
			`'
              DECLARE @End date ='` +
			context.endDate +
			`'
			  SELECT a.* FROM [dbo].[ClientDailyStatementData] AS a
			  JOIN [Clients] B ON B.ID  = A.[ClientID]
			  WHERE B.[CompanyID] = ${user.companyId}
			    AND(a.[Date] >=@Start AND a.[Date] <=@End)`;
	}
	if (context.id !== undefined) {
		query += `\nAND a.[ClientID] = ` + context.clientId;
	}
	query += `\nORDER BY a.[ClientID], a.[Date];`;

	// console.log(query)
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.retrieveStatementData = retrieveStatementData;

// Create a new client on a POST HTTP request
async function createMonthlyStatement(user, data) {
	console.log('createMonthlyStatement(context, data)/[ClientMonthlyStatement]');
	// console.log(post);
	let month = data.month;
	let year = data.year;

	let previousMonth = month;
	let previousYear = year;

	if (month == 1) {
		previousMonth = 12;
		previousYear = year - 1;
	} else {
		previousMonth = month - 1;
		previousYear = year;
	}
	// console.log('previousMonth:' + previousMonth + '-previousYear:' + previousYear);
	let basicDailyFee = 0;
	let incomeTestedFee = 0;
	let governmentSubsidy = 0;
	let suppSubsidy = 0;
	let careServices = 0;
	let thirdPartyServices = 0;
	let administrativeFee = 0.0;
	let coreAdvisoryFee = 0.0;
	let totalFunding = 0;
	let totalExpenditure = 0;
	let totalTransfer = 0;
	let num = data.clientIds ? data.clientIds.length : undefined; // Length of clientId array
	let numClient = 0;
	let clientContributionAdjustAmount = 0;
	let govContributionAdjustAmount = 0;
	let clientExpenditureAdjustAmount = 0;
	let adminFeeAdjustAmount = 0;
	let advisoryFeeAdjustAmount = 0;
	let clientTransferAdjustAmount = 0;
	let govTransferAdjustAmount = 0;

	let createSql = `BEGIN TRY
    BEGIN TRANSACTION ;
    SET IMPLICIT_TRANSACTIONS ON;\n`;

	if (month !== undefined && year !== undefined)
		data.clientIds.forEach((item, index) => {
			let currentClient = item.ClientID;
			let nextClient = index < num - 1 ? data.clientIds[index + 1].ClientID : '';
			let totalPackageValue = item.HCPAmount + item.IncomeTestedFee + item.BasicDailyFee;
			basicDailyFee += item.BasicDailyFee;
			incomeTestedFee += item.IncomeTestedFee;
			governmentSubsidy += item.HCPAmount;
			suppSubsidy += item.SuppAmount;
			careServices += item.CarerServiceCost;
			thirdPartyServices += item.ThirdPartyServiceCost;
			administrativeFee += item.AdminRate * totalPackageValue;
			coreAdvisoryFee += item.MgmtRate * totalPackageValue;
			// console.log(administrativeFee);
			// totalFunding += item.HCPAmount + item.SuppAmount + item.IncomeTestedFee + item.BasicDailyFee + item.ClientContributionAdjustAmount + item.GovContributionAdjustAmount;
			// totalExpenditure +=  item.CarerServiceCost + item.ThirdPartyServiceCost + item.AdminRate * totalPackageValue + item.MgmtRate * totalPackageValue + item.ClientExpenditureAdjustAmount;
			clientContributionAdjustAmount += item.ClientContributionAdjustAmount;
			govContributionAdjustAmount += item.GovContributionAdjustAmount;
			clientExpenditureAdjustAmount += item.ClientExpenditureAdjustAmount;
			adminFeeAdjustAmount += item.AdminFeeAdjust;
			advisoryFeeAdjustAmount += item.AdvisoryFeeAdjust;
			clientTransferAdjustAmount += item.ClientTransferAdjust;
			govTransferAdjustAmount += item.GovTransferAdjust;
			exitFee = 0.0;

			if (currentClient !== nextClient) {
				// For each client
				numClient = numClient + 1;

				let valueset1 = [
					month,
					year,
					currentClient,
					basicDailyFee,
					incomeTestedFee,
					governmentSubsidy,
					suppSubsidy,
					careServices,
					thirdPartyServices,
					administrativeFee,
					coreAdvisoryFee,
				];
				let valueset2 = [
					clientContributionAdjustAmount,
					govContributionAdjustAmount,
					clientExpenditureAdjustAmount,
					exitFee,
					adminFeeAdjustAmount,
					advisoryFeeAdjustAmount,
					clientTransferAdjustAmount,
					govTransferAdjustAmount,
				];

				totalFunding =
					tools.roundUp(governmentSubsidy) +
					tools.roundUp(suppSubsidy) +
					tools.roundUp(basicDailyFee) +
					tools.roundUp(incomeTestedFee) +
					tools.roundUp(govContributionAdjustAmount) +
					tools.roundUp(clientContributionAdjustAmount);

				totalTransfer = tools.roundUp(govTransferAdjustAmount) + tools.roundUp(clientTransferAdjustAmount);

				totalExpenditure =
					tools.roundUp(careServices) +
					tools.roundUp(thirdPartyServices) +
					tools.roundUp(administrativeFee) +
					tools.roundUp(coreAdvisoryFee) +
					tools.roundUp(advisoryFeeAdjustAmount + adminFeeAdjustAmount + clientExpenditureAdjustAmount);

				let currentBalance = totalFunding + totalTransfer - totalExpenditure;

				if (numClient == 1) {
					/* The first client */
					//  Start transaction

					createSql += `DECLARE @ClientID int = 0
                    DECLARE @initialBalance decimal(18,2) = 0.00
                    DECLARE @previousBalance decimal(18,2) = 0.00
                    DECLARE @receivedGovernmentSubsidy decimal(18,2) = 0.00
                    DECLARE @receivedSuppSubsidy decimal(18,2) = 0.00
                    DECLARE @receivedIncomeTestedFee decimal(18,2) = 0.00
                    DECLARE @totalFunding decimal(18,2) = 0.00
                    DECLARE @currentBalance decimal(18,2) = 0.00
                    DECLARE @receivedTotalFunding decimal(18,2) = 0.00
                    DECLARE @firstMonth int = 0
                    DECLARE @firstYear int =0`;
				}
				createSql +=
					`\nSET @ClientID = ` +
					currentClient +
					`\nSET @firstMonth = (SELECT MONTH([ServiceStartDate]) FROM [dbo].[Client] WHERE ClientID= @clientID)` +
					`\nSET @firstYear = (SELECT YEAR([ServiceStartDate]) FROM [dbo].[Client] WHERE ClientID= @clientID)` +
					`\nSET @initialBalance = (SELECT Sum(Amount) FROM [dbo].[ClientInitialBalance] WHERE ClientID = @ClientID)` +
					`\nSET @receivedGovernmentSubsidy = (SELECT Sum(ReceivedAmount) FROM [InboundTransaction] WHERE ClientID=@ClientID AND Month=` +
					month +
					` AND Year=` +
					year +
					` AND InboundID= 1)` +
					`\nSET @receivedIncomeTestedFee = (SELECT Sum(ReceivedAmount) FROM [InboundTransaction] WHERE ClientID=@ClientID AND Month=` +
					month +
					` AND Year=` +
					year +
					` AND InboundID= 2)` +
					`\nSET @receivedSuppSubsidy = (SELECT Sum(ReceivedAmount) FROM [InboundTransaction] WHERE ClientID=@ClientID AND Month=` +
					month +
					` AND Year=` +
					year +
					` AND InboundID= 3)

                        IF @receivedGovernmentSubsidy is null
                            SET @receivedGovernmentSubsidy =0.00

                        IF @receivedIncomeTestedFee is null
                            SET @receivedIncomeTestedFee =0.00

                        IF @receivedSuppSubsidy is null
                            SET @receivedSuppSubsidy =0.00

                        SET @receivedTotalFunding  = @receivedGovernmentSubsidy + @receivedIncomeTestedFee + @receivedSuppSubsidy
                        SET @totalFunding = ` +
					totalFunding +
					`
                        SET @currentBalance = ` +
					currentBalance +
					`


                        IF (@firstMonth = ` +
					month +
					` AND @firstYear =` +
					year +
					`)
                            SET @previousBalance = @initialBalance

                        ELSE 
                            SET @previousBalance = (SELECT [CloseBalance] FROM [dbo].[ClientMonthlyStatement]
                            WHERE Month = ` +
					previousMonth +
					` AND Year = ` +
					previousYear +
					` AND ClientID=@ClientID)` +
					`\nINSERT INTO  [dbo].[ClientMonthlyStatement] VALUES (` +
					valueset1.join(',') +
					`,ROUND(@previousBalance, 4), @previousBalance + @currentBalance,` +
					[ `@totalFunding`, totalExpenditure ].join(',') +
					`, GetDate(),  @receivedIncomeTestedFee, @receivedGovernmentSubsidy, @receivedSuppSubsidy,@receivedTotalFunding,` +
					valueset2.join(',') +
					`)`;

				// Reset all values of the next client
				basicDailyFee = 0;
				incomeTestedFee = 0;
				governmentSubsidy = 0;
				suppSubsidy = 0;
				careServices = 0;
				thirdPartyServices = 0;
				administrativeFee = 0;
				coreAdvisoryFee = 0;
				totalFunding = 0;
				totalExpenditure = 0;
				clientContributionAdjustAmount = 0;
				govContributionAdjustAmount = 0;
				clientExpenditureAdjustAmount = 0;
				adminFeeAdjustAmount = 0;
				advisoryFeeAdjustAmount = 0;
				clientTransferAdjustAmount = 0;
				govTransferAdjustAmount = 0;
			}
		});

	// Commit the transaction
	createSql += `COMMIT
           END TRY
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
       END CATCH`;

	// console.log(createSql)
	const result = await database.simpleExecute(createSql);
	return result;
}

module.exports.createMonthlyStatement = createMonthlyStatement;

function getPaymentReceived(id, month, year, type) {
	console.log('getPaymentReceived(id,month,year,type)/[InboundTransaction]');

	let query = `SELECT sum(ReceivedAmount) as ReceivedAmount  FROM [InboundTransaction] a`;

	if (id !== undefined) {
		query += `\nWHERE a.[ClientID] =` + id;

		if (month !== undefined) {
			query += `\nAND a.[Month] =` + month;
		}
		if (year !== undefined) {
			query += `\nAND a.[Year] =` + year;
		}

		if (type !== undefined) {
			query += `\nAND a.[InboundID] =` + type;
		}
	}

	// console.log(query)
	const result = database.simpleExecute2(query);
	return result.recordset;
}

module.exports.getPaymentReceived = getPaymentReceived;

async function getMonthlyStatement(user, context) {
	console.log('getMonthlyStatement(context)/[ClientMonthlyStatement]');
	// console.log(context);
	let month = context.month;
	let year = context.year;
	let query = '';

	query += `SELECT a.* FROM [dbo].[ClientMonthlyStatement] AS a
    JOIN [dbo].[Clients] AS c
	ON a.ClientID = c.ID
	WHERE c.CompanyID = ${user.companyId}
	`;

	if (month !== undefined && year !== undefined) {
		query += ` AND a.Month =` + month + ` AND a.Year =` + year;
	}

	if (context.clientId) {
		query += ` AND a.[ClientID] =` + context.clientId;
	}

	// console.log(query)
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getMonthlyStatement = getMonthlyStatement;

async function getOpeningBalanceStatement(context) {
	console.log('getOpenBalanceStatement(context)/[ClientMonthlyStatement]');
	let month = context.month;
	let year = context.year;
	let query = '';

	query +=
		`
    DECLARE @ClientID  INT = ` +
		context.clientId +
		`
    DECLARE @receivedGovernmentSubsidy decimal(18,2) = 0.00
    DECLARE @receivedIncomeTestedFee decimal(18,2) = 0.00
    DECLARE @receivedSuppSubsidy decimal(18,2) = 0.00

    SET @receivedGovernmentSubsidy = (SELECT Sum(ReceivedAmount) FROM [InboundTransaction] AS a WHERE ClientID=@ClientID AND (Month <` +
		month +
		` AND Year=` +
		year +
		` OR (a.Year <` +
		year +
		`)) AND InboundID= 1)
    SET @receivedIncomeTestedFee = (SELECT Sum(ReceivedAmount) FROM [InboundTransaction] AS a WHERE ClientID=@ClientID AND (Month <` +
		month +
		` AND Year=` +
		year +
		` OR (a.Year <` +
		year +
		`)) AND InboundID= 2)
    SET @receivedSuppSubsidy = (SELECT Sum(ReceivedAmount) FROM [InboundTransaction] AS a WHERE ClientID=@ClientID AND (Month <` +
		month +
		` AND Year=` +
		year +
		` OR (a.Year <` +
		year +
		`)) AND InboundID= 3)
    
    IF @receivedGovernmentSubsidy is null SET @receivedGovernmentSubsidy = 0
    IF @receivedIncomeTestedFee is null SET @receivedIncomeTestedFee = 0
    IF @receivedSuppSubsidy is null SET @receivedSuppSubsidy = 0
    `;

	query += `\nSELECT 
    sum([BasicDailyFee]+[IncomeTestedFee]) as ExpectedClientContribution,
    sum([ClientContributionAdjustAmount]) as ExpectedClientContributionAdjust,
    sum([GovernmentSubsidy]) as ExpectedGovernmentContribution,
    sum([SuppSubsidy]) as ExpectedSuppContribution,
    sum([GovContributionAdjustAmount]) as ExpectedGovernmentContributionAdjust,
    sum([TotalFunding]) as ExpectedTotalFunding,
    sum([TotalExpenditure]) as ExpectedTotalExpenditure,
    sum([CareServices]+[ThirdPartyServices]) as ServicesExpenditure,
    sum([ClientExpenditureAdjustAmount]) as ServicesExpenditureAdjust,
    sum([AdministrativeFee]) as AdminExpenditure,
    sum([AdminFeeAdjust]) as AdminExpenditureAdjust,
    sum([CoreAdvisoryFee]) as AdvisoryExpenditure,
    sum([AdminFeeAdjust] + [AdvisoryFeeAdjust] + [ClientExpenditureAdjustAmount]) as OutboundAdjustAmount,
    sum([AdvisoryFeeAdjust]) as AdvisoryExpenditureAdjust,
    sum([ClientTransferAdjust]) as ClientTransferAdjust,
    sum([GovTransferAdjust]) as GovTransferAdjust,
    @receivedIncomeTestedFee  as ReceivedClientContribution,
    @receivedGovernmentSubsidy as ReceivedGovernmentContribution,
    @receivedSuppSubsidy as ReceivedSuppContribution
    FROM [dbo].[ClientMonthlyStatement] AS a`;

	if (month !== undefined && year !== undefined) {
		query += `\nWHERE ((a.Month <` + month + ` AND a.Year =` + year + `)`;
		query += ` OR (a.Year <` + year + `))`;
	}

	if (context.clientId) {
		query += `AND a.[ClientID] =` + context.clientId;
	}

	// console.log(query)
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getOpeningBalanceStatement = getOpeningBalanceStatement;

// function isTheFirstPeriod(id, month, year){
//     console.log("function isTheFirstPeriod(id, month, year)/return 0 or 1");

//     let sql = `DECLARE @clientID int = `+id+`
//             DECLARE @month int = 0
//             DECLARE @year int =0
//             SET @month = SELECT MONTH([ServiceStartDate]) FROM [dbo].[Client] WHERE ClientID= @clientID
//             SET @year = SELECT YEAR([ServiceStartDate]) FROM [dbo].[Client] WHERE ClientID= @clientID
//             IF @month = `+month+` AND @year =` +year+`
//                 RETURN 1
//             ELSE
//                 RETURN 0
//             `;
//     console.log(sql)
//     const result = database.simpleExecute2(sql);
//     return result;
// }
// module.exports.isTheFirstPeriod = isTheFirstPeriod;

// retrieve high level client and statement information for clients that had a HCP during a month
async function getClient(user, queryParams) {
	console.log('Run: function getClient(user, queryParams)');
	let query = ``;

	if (queryParams.month && queryParams.year) {
		const month = parseInt(queryParams.month);
		const year = parseInt(queryParams.year);

		const firstDay = tools.firstDayOfMonth(month, year);
		const lastDay = tools.lastDayOfMonth(month, year);
		const prevMonth = month === 1 ? 12 : month - 1;
		const prevMonthYear = month === 1 ? year - 1 : year;

		query += `SELECT
		C.[ID] AS id,
		C.[First Name] + ' ' + C.[Last Name] AS name,
		C.[Last Name] + ', ' + C.[First Name] AS name2,
		C.[Date of Birth] AS dateOfBirth,
		C.[City] AS locality,
		STUFF((SELECT ', ' + L.[Name] FROM HCPLevel L JOIN [ClientHCP] CH ON L.[HCPLevelCode] = CH.[HCPLevelCode] WHERE CH.[ClientID] = C.[ID] AND CH.[StartDate] <= '${lastDay}' AND (CH.[EndDate] >= '${firstDay}' OR CH.[EndDate] IS NULL)FOR XML PATH('')), 1, 2, '') AS packages,
		M2.[BasicDailyFee] AS basicDailyFee,
		M2.[IncomeTestedFee] AS incomeTestedFee,
		M2.[GovernmentSubsidy] AS governmentSubsidy,
		M2.[suppSubsidy] AS suppSubsidy,
		M2.[CareServices] AS careServices,
		M2.[ThirdPartyServices] AS thirdPartyServices,
		M2.[AdministrativeFee] AS administrativeFee,
		M2.[CoreAdvisoryFee] AS coreAdvisoryFee,
		M1.[CloseBalance] AS openBalance,
		M2.[CloseBalance] AS closeBalance
	   FROM Clients C
	   LEFT JOIN ClientMonthlyStatement M1 ON M1.[ClientID] = C.[ID] AND M1.[Month] = ${prevMonth} AND M1.[Year] = ${prevMonthYear} 
	   LEFT JOIN ClientMonthlyStatement M2 ON M2.[ClientID] = C.[ID] AND M2.[Month] = ${month} AND M2.[Year] = ${year}
	   WHERE C.[CompanyID] = ${user.companyId}
		 AND C.[ID] IN (SELECT DISTINCT [ClientID] FROM ClientHCP WHERE [StartDate] <= '${lastDay}' AND ([EndDate] >= '${firstDay}' OR [EndDate] IS NULL))
	   ORDER BY name2`;
	}

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.getClient = getClient;
