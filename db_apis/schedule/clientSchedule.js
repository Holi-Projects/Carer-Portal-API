const sql = require('mssql');
const database = require('../../services/database.js');
const { mapDataForInsert } = require('../../utils/mapUtils');
const { mapDataForSelect } = require('../../utils/mapUtils');
const { mapDataForUpdate } = require('../../utils/mapUtils');
const carersDays = require('./carersDays');
const clientScheduleFunding = require('./clientScheduleFunding');
const { utcDate2dbDate } = require('../../utils/dateTimeUtil');
const dateTimeUtil = require('../../utils/dateTimeUtil');

const dataFields = {
	id            : '[Client Schedule Seq No]',
	clientId      : '[Client ID]',
	//overnight       : '[Overnight]',
	//overnightActive : '[Overnight Active]',
	//shift24Hr       : '[24Hr]',
	shiftTypeId   : '[ShiftTypeNo]',
	fortnightly   : '[Fortnightly]',
	monthly       : '[Monthly]',
	weekNo        : '[WeekNo]',
	recurringWeek : '[RecurringWeek]',
	avoidHolidays : '[Avoid Holidays]',
	location      : '[Location]',
	duties        : '[Duties]',
	comments      : '[Comments]',
};
const primaryKey = dataFields.id;

const dateTimeFields = {
	scheduleStartDate  : '[Schedule Start Date]',
	scheduleFinishDate : '[Schedule Finish Date]',
};

const timeFields = {
	startTime : '[Start Time]',
	endTime   : '[End Time]',
};

const dbFields = {
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

async function list(user, queryParams) {
	console.log('DB:clientSchedule.list(user, queryParams)');
	console.log(`id: ${queryParams}`);
	let clientId = queryParams.clientId == undefined ? null : queryParams.clientId;
	let carerId = queryParams.carerId == undefined ? null : queryParams.carerId;

	let query = ``;
	let fieldList = mapDataForSelect('A', dbFields, primaryKey, user.companyTimezone);

	query = `SELECT ${fieldList}
			, RTRIM(C.[Task Name]) as taskCode
			, C.Title as taskName
			, C.ID as taskId
			, CASE WHEN (SELECT TOP 1 D.Monday FROM [dbo].[Clients Schedule Carers] D WHERE D.Monday = 1 AND (D.[Client Schedule Seq No] = A.${primaryKey})) IS NOT NULL THEN 1 ELSE 0 END AS Mon
			, CASE WHEN (SELECT TOP 1 D.Tuesday FROM [dbo].[Clients Schedule Carers] D WHERE D.Tuesday = 1 AND (D.[Client Schedule Seq No] = A.${primaryKey})) IS NOT NULL THEN 1 ELSE 0 END AS Tue
			, CASE WHEN (SELECT TOP 1 D.Wednesday FROM [dbo].[Clients Schedule Carers] D WHERE D.Wednesday = 1 AND (D.[Client Schedule Seq No] = A.${primaryKey})) IS NOT NULL THEN 1 ELSE 0 END AS Wed
			, CASE WHEN (SELECT TOP 1 D.Thursday FROM [dbo].[Clients Schedule Carers] D WHERE D.Thursday = 1 AND (D.[Client Schedule Seq No] = A.${primaryKey})) IS NOT NULL THEN 1 ELSE 0 END AS Thu
			, CASE WHEN (SELECT TOP 1 D.Friday FROM [dbo].[Clients Schedule Carers] D WHERE D.Friday = 1 AND (D.[Client Schedule Seq No] = A.${primaryKey})) IS NOT NULL THEN 1 ELSE 0 END AS Fri
			, CASE WHEN (SELECT TOP 1 D.Saturday FROM [dbo].[Clients Schedule Carers] D WHERE D.Saturday = 1 AND (D.[Client Schedule Seq No] = A.${primaryKey})) IS NOT NULL THEN 1 ELSE 0 END AS Sat
			, CASE WHEN (SELECT TOP 1 D.Sunday FROM [dbo].[Clients Schedule Carers] D WHERE D.Sunday = 1 AND (D.[Client Schedule Seq No] = A.${primaryKey}) ) IS NOT NULL THEN 1 ELSE 0 END AS Sun
			, D.ShiftTypeName as shiftTypeName
			, CASE WHEN ([Start Time] < [End Time]) THEN ABS (DATEDIFF(minute, [Start Time], [End Time])/60.0)
            ELSE 24 - ABS (DATEDIFF(minute, [Start Time], [End Time])/60.0) END as duration
			--, ABS (DATEDIFF(minute, [Start Time], [End Time])/60.0) as duration
            FROM [dbo].[Clients Schedule] A
            LEFT JOIN [dbo].[Clients Tasks] B ON A.[Client Task Seq No] = B.[Client Task Seq No]
			LEFT JOIN [dbo].[Tasks] C ON B.[Task ID] = C.ID
			LEFT JOIN [dbo].[Ref Shift Types] D ON A.[ShiftTypeNo] = D.[ShiftTypeNo]
            WHERE C.[Task Name] IS NOT NULL AND (A.[Schedule Finish Date] > GETDATE() OR A.[Schedule Finish Date] IS NULL)`;

	if (clientId !== null) {
		query += `
                AND A.[Client ID] = ${clientId}`;
	}

	if (carerId !== null) {
		query += `
                AND A.[Carer ID] = ${carerId}`;
	}

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.list = list;

async function get(user, id) {
	console.log('DB:clientSchedule.get(user, id)');
	console.log(`id: ${id}`);

	let query = ``;
	if (id !== undefined) {
		let fieldList = mapDataForSelect('A', dbFields, primaryKey, user.companyTimezone);

		query = `SELECT DISTINCT ${fieldList}
				, RTRIM(C.[Task Name]) as taskCode
				, C.Title as taskName
				, C.ID as taskId
				, CASE WHEN (SELECT distinct Monday from [Clients Schedule Carers] WHERE Monday = 1 and [Client Schedule Seq No] = ${id}) IS NOT NULL THEN 1 ELSE 0 END AS Mon
				, CASE WHEN (SELECT distinct Tuesday from [Clients Schedule Carers] WHERE Tuesday = 1 and [Client Schedule Seq No] = ${id}) IS NOT NULL THEN 1 ELSE 0 END AS Tue
				, CASE WHEN (SELECT distinct Wednesday from [Clients Schedule Carers] WHERE Wednesday = 1 and [Client Schedule Seq No] = ${id}) IS NOT NULL THEN 1 ELSE 0 END AS Wed
				, CASE WHEN (SELECT distinct Thursday from [Clients Schedule Carers] WHERE Thursday = 1 and [Client Schedule Seq No] = ${id}) IS NOT NULL THEN 1 ELSE 0 END AS Thu
				, CASE WHEN (SELECT distinct Friday from [Clients Schedule Carers] WHERE Friday = 1 and [Client Schedule Seq No] = ${id}) IS NOT NULL THEN 1 ELSE 0 END AS Fri
				, CASE WHEN (SELECT distinct Saturday from [Clients Schedule Carers] WHERE Saturday = 1 and [Client Schedule Seq No] = ${id}) IS NOT NULL THEN 1 ELSE 0 END AS Sat
				, CASE WHEN (SELECT distinct Sunday from [Clients Schedule Carers] WHERE Sunday = 1 and [Client Schedule Seq No] = ${id}) IS NOT NULL THEN 1 ELSE 0 END AS Sun
				, CASE WHEN ([Start Time] < [End Time]) THEN ABS (DATEDIFF(minute, [Start Time], [End Time])/60.0)
            	ELSE 24 - ABS (DATEDIFF(minute, [Start Time], [End Time])/60.0) END as duration
				--, ABS (DATEDIFF(minute, [Start Time], [End Time])/60.0) as duration
            FROM [Clients Schedule] A
            LEFT JOIN [Clients Tasks] B ON A.[Client Task Seq No] = B.[Client Task Seq No]
            LEFT JOIN [Tasks] C ON B.[Task ID] = C.ID
			WHERE A.${primaryKey} = ${id}`;
	}

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.get = get;

// Update client schedule information

const clientScheduleCarerDataFields = {
	id               : '[ClientScheduleCarerNo]',
	clientScheduleId : '[Client Schedule Seq No]',
	carerId          : '[Carer ID]',
	monday           : '[Monday]',
	tuesday          : '[Tuesday]',
	wednesday        : '[Wednesday]',
	thursday         : '[Thursday]',
	friday           : '[Friday]',
	saturday         : '[Saturday]',
	sunday           : '[Sunday]',
};

const clientScheduleCarerDateTimeFields = {
	confirmClientRequested : '[ConfirmClientRequested]',
	confirmedClient        : '[ConfirmedClient]',
	confirmCarerRequested  : '[ConfirmCarerRequested]',
	confirmedCarer         : '[ConfirmedCarer]',
};

const clientScheduleCarerDbFields = {
	dataFields     : clientScheduleCarerDataFields,
	dateTimeFields : clientScheduleCarerDateTimeFields,
	timeFields     : {},
};

const clientScheduleFundingDataFields = {
	id                : '[ClientScheduleFundNo]',
	clientScheduleId  : '[Client Schedule Seq No]',
	agencyClientId    : '[AgencyClientSeqNo]',
	//pricingGroupId    : '[PricingGroupNo]',
	//invoiceToClientId : '[Invoice To Client ID]',
	//invoiceToAgencyId : '[Invoice To Agency ID]',
	percentageCharged : '[Percentage Charged]',
};

const clientScheduleFundingDateTimeFields = {
	startDate : '[ChargeStartDate]',
	endDate   : '[ChargeFinishDate]',
};

const clientScheduleFundingDbFields = {
	dataFields     : clientScheduleFundingDataFields,
	dateTimeFields : clientScheduleFundingDateTimeFields,
	timeFields     : {},
};

async function update(user, id, data) {
	console.log('DB:clientSchedule.update(user, carerId, data)');

	//  Start transaction
	let query = `BEGIN TRY
		BEGIN TRANSACTION ;
		SET IMPLICIT_TRANSACTIONS ON;\n`;

	const keyValueList = mapDataForUpdate(data, dbFields, primaryKey, user.companyTimezone);

	if (data.taskId !== undefined) {
		// check if taskId exists in [Clients Tasks] table and insert if it is not there.
		const kvListA = [ ...keyValueList ];
		const kvListB = [ ...keyValueList ];
		kvListA.push('[Client Task Seq No]=@@IDENTITY'); // used when a new [Clients Tasks] row is created
		kvListB.push('[Client Task Seq No]=@taskSeqNo'); // used when the taskId is already in [Clients Tasks]

		query += `
			DECLARE @taskSeqNo INT = (
				SELECT CT.[Client Task Seq No] 
				FROM [Clients Tasks] CT 
				JOIN [Clients Schedule] CS ON CS.[Client ID] = CT.[Client ID]
				WHERE CS.${primaryKey} = ${id} 
					AND CT.[Task ID] = ${data.taskId});

			IF (@taskSeqNo IS NULL)
				BEGIN 
					INSERT INTO [Clients Tasks] ([Client ID], [Task ID]) 
					    VALUES ((SELECT [CLient ID] FROM [Clients Schedule] WHERE ${primaryKey} = ${id}), ${data.taskId});
					UPDATE [Clients Schedule] SET ${kvListA} WHERE ${primaryKey}=${id};
				END
			ELSE
				UPDATE [Clients Schedule] SET ${kvListB} WHERE ${primaryKey}=${id};\n`;
	} else if (keyValueList.length > 0) {
		query += `UPDATE [Clients Schedule] SET ${keyValueList} WHERE ${primaryKey}=${id};\n`;
	}

	// iterate through carerDays array
	if (data.carerDays) {
		const primaryKey = clientScheduleCarerDataFields.id;
		const dbFields = clientScheduleCarerDbFields;

		for (let i = 0; i < data.carerDays.length; i++) {
			const carerDay = data.carerDays[i];
			if (carerDay.type !== undefined) {
				if (carerDay.type === 'insert') {
					if (carerDay.data !== undefined) {
						const data = carerDay.data;
						data.clientScheduleId = id;

						const [ fieldList, valueList ] = mapDataForInsert(
							data,
							dbFields,
							primaryKey,
							user.companyTimezone
						);
						query += `INSERT INTO [Clients Schedule Carers] (${fieldList}) OUTPUT INSERTED.${primaryKey} AS id VALUES (${valueList});\n`;
					}
				} else if (carerDay.type === 'update') {
					if (carerDay.data !== undefined) {
						const data = carerDay.data;
						data.clientScheduleId = id;

						const keyValueList = mapDataForUpdate(
							carerDay.data,
							dbFields,
							primaryKey,
							user.companyTimezone
						);
						if (carerDay.key)
							query += `UPDATE [Clients Schedule Carers] SET ${keyValueList} WHERE ${primaryKey}=${carerDay.key};\n`;
					}
				} else if (carerDay.type === 'remove') {
					if (carerDay.key)
						query += `DELETE FROM [Clients Schedule Carers] OUTPUT DELETED.${primaryKey} AS id WHERE ${primaryKey} = ${carerDay.key};\n`;
				}
			}
		}
	}

	// iterate throught funding array
	if (data.funding) {
		const primaryKey = clientScheduleFundingDataFields.id;
		const dbFields = clientScheduleFundingDbFields;

		for (let i = 0; i < data.funding.length; i++) {
			const funding = data.funding[i];
			if (funding.type !== undefined) {
				if (funding.type === 'insert') {
					if (funding.data !== undefined) {
						const data = funding.data;
						data.clientScheduleId = id;

						const [ fieldList, valueList ] = mapDataForInsert(
							data,
							dbFields,
							primaryKey,
							user.companyTimezone
						);
						query += `INSERT INTO [Clients Schedule Funding] (${fieldList}) OUTPUT INSERTED.${primaryKey} AS id VALUES (${valueList});\n`;
					}
				} else if (funding.type === 'update') {
					if (funding.data !== undefined) {
						const data = funding.data;
						data.clientScheduleId = id;

						const keyValueList = mapDataForUpdate(data, dbFields, primaryKey, user.companyTimezone);
						if (funding.key)
							query += `UPDATE [Clients Schedule Funding] SET ${keyValueList} WHERE ${primaryKey}=${funding.key};\n`;
					}
				} else if (funding.type === 'remove') {
					if (funding.key)
						query += `DELETE FROM [Clients Schedule Funding] OUTPUT DELETED.${primaryKey} AS id WHERE ${primaryKey} = ${funding.key};\n`;
				}
			}
		}
	}

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
	//console.log(result);
	return result;
}
module.exports.update = update;

async function insert(user, data) {
	console.log('DB:clientSchedule.insert(user, data)');
	let [ fieldList, valueList ] = mapDataForInsert(data, dbFields, primaryKey, user.companyTimezone);

	// Check Manadatory Fields
	if (data.clientId === undefined) {
		console.log('Client ID is Mandatory');
		return { message: 'Client ID is Mandatory' };
	}

	if (data.taskId === undefined) {
		console.log('Task ID is Mandatory');
		return { message: 'Task ID is Mandatory' };
	}

	//  Start transaction
	let query = `BEGIN TRY
		BEGIN TRANSACTION ;
		SET IMPLICIT_TRANSACTIONS ON;\n`;

	// check if taskId exists in [Clients Tasks] table and insert if it is not there.
	query += `
		DECLARE @taskSeqNo INT = (SELECT [Client Task Seq No] FROM [Clients Tasks]
			WHERE [Client ID] = ${data.clientId} AND [Task ID] = ${data.taskId});
		DECLARE @clientScheduleId INT;

		IF (@taskSeqNo IS NULL)
			BEGIN 
			INSERT INTO [Clients Tasks] ([Client ID],[Task ID]) VALUES (${data.clientId},${data.taskId});\n
			INSERT INTO [Clients Schedule] (${fieldList},[Client Task Seq No]) OUTPUT INSERTED.${primaryKey} AS id VALUES (${valueList},@@IDENTITY);  
			END
		ELSE
		INSERT INTO [Clients Schedule] (${fieldList},[Client Task Seq No]) OUTPUT INSERTED.${primaryKey} AS id VALUES (${valueList},@taskSeqNo);

	SET @clientScheduleId = @@IDENTITY;\n`;

	// iterate through carerDays array
	if (data.carerDays) {
		const primaryKey = clientScheduleCarerDataFields.id;
		const dbFields = clientScheduleCarerDbFields;

		for (let i = 0; i < data.carerDays.length; i++) {
			const [ fieldList, valueList ] = mapDataForInsert(
				data.carerDays[i],
				dbFields,
				primaryKey,
				user.companyTimezone
			);
			// fieldList.push(clientScheduleCarerDataFields.clientScheduleId);
			// valueList.push('@clientScheduleId');
			valueList.splice(0, 1, '@clientScheduleId');
			query += `INSERT INTO [Clients Schedule Carers] (${fieldList}) OUTPUT INSERTED.${primaryKey} AS id VALUES (${valueList});\n`;
		}
	}

	// iterate throught funding array
	if (data.funding) {
		const primaryKey = clientScheduleFundingDataFields.id;
		const dbFields = clientScheduleFundingDbFields;

		for (let i = 0; i < data.funding.length; i++) {
			const [ fieldList, valueList ] = mapDataForInsert(
				data.funding[i],
				dbFields,
				primaryKey,
				user.companyTimezone
			);
			// fieldList.push(clientScheduleFundingDataFields.clientScheduleId);
			// valueList.push('@clientScheduleId');
			valueList.splice(0, 1, '@clientScheduleId');
			query += `INSERT INTO [Clients Schedule Funding] (${fieldList}) OUTPUT INSERTED.${primaryKey} AS id VALUES (${valueList});\n`;
		}
	}

	// Catch errors
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
	result = await database.simpleExecute(query);
	console.log(result);
	return result;
}
module.exports.insert = insert;

async function remove(user, id) {
	console.log('DB:clientSchedule.remove(user, id)');

	//  Start transaction
	let query = `BEGIN TRY
		BEGIN TRANSACTION ;
		SET IMPLICIT_TRANSACTIONS ON;\n`;

	// iterate through carerDays array
	const carers = await carersDays.getList(user, id);
	for (let i = 0; i < carers.length; i++) {
		const carer = carers[i];
		query += `DELETE FROM [Clients Schedule Carers] WHERE ${clientScheduleCarerDataFields.id} = ${carer.id};\n`;
	}

	// iterate through funding array
	const fundings = await clientScheduleFunding.getList(user, id);
	for (let i = 0; i < fundings.length; i++) {
		const funding = fundings[i];
		query += `DELETE FROM [Clients Schedule Funding] WHERE ${clientScheduleFundingDataFields.id} = ${funding.id};\n`;
	}

	// Delete [Clients Schedule] record
	query += `DELETE FROM [Clients Schedule]
        OUTPUT DELETED.${primaryKey} AS id
		WHERE ${primaryKey} = ${id}`;

	// Remove [Client Schedule Seq No] from bookings
	// query += `UPDATE [Bookings]
	// 	SET [Client Schedule Seq No] = NULL
	// 	WHERE [Client Schedule Seq No] = ${id}`;

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

async function populateSchedule(user, id, data) {
	console.log('DB:populateSchedule(user, id, data)');

	if (user.confirmClientRequesteduserType !== 'employee') {
	}

	const startDateExpr = utcDate2dbDate(`'${data.startDate}'`, user.companyTimezone);
	//console.log(startDateExpr);
	const query = `SELECT ${startDateExpr} AS dbStartDate`;
	let result = await database.simpleExecute(query);
	//console.log(result);
	console.log(result.recordset[0]);

	let inParams = [
		{ name: 'pCompanyID', type: sql.Int, value: user.companyId },
		{ name: 'pStartDate', type: sql.DateTime, value: result.recordset[0].dbStartDate },
		{ name: 'pServiceSeqNo', type: sql.Int, value: id },
		{ name: 'pEmpNo', type: sql.Int, value: user.userId },
		{ name: 'pAuditAction', type: sql.VarChar(255), value: 'Std Service Start ' + result.recordset[0].dbStartDate },
	];

	console.log(inParams);
	const outParams = [ { name: 'pResCode', type: sql.Int } ];

	result = await database.runStoredProcedure('spPopulateSchedule', inParams, outParams);
	console.log('after calling runStoredProcedure()');
	console.log(result);
	return result.returnValue;
}
module.exports.populateSchedule = populateSchedule;

async function getNumberOfBookings(user, id) {
	console.log('DB:clientSchedule.isValidTodelete(user, id)');
	console.log(`id: ${id}`);
	let query = ``;
	if (id !== undefined) {
		query = `
		SELECT count(*) as num FROM [CarerDataDev].[dbo].[Bookings] 
							WHERE [Client Schedule Seq No] = ${id} AND [CompanyID] = ${user.companyId}
		`;
	}

	console.log(query);
	const result = await database.simpleExecute(query);

	return result.recordset;
}
module.exports.getNumberOfBookings = getNumberOfBookings;


async function getMaxBookingDate(user, id) {
	console.log('getStdServiceMaxBookingDate(user, id)');
	query = ` SELECT ${dateTimeUtil.dbDate2utcDate('MAX([Booking date])', user.companyTimezone)} AS maxBookingDate
	FROM [dbo].[Bookings] A
    WHERE A.[CompanyID] = ${user.companyId}
    AND A.[Client Schedule Seq No] = ${id}`;
	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.getMaxBookingDate = getMaxBookingDate;
