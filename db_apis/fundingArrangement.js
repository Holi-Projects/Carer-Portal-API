const database = require('../services/database.js');
const dateTimeUtil = require('../utils/dateTimeUtil');

const dbField = {
	id                  : '[SeqNo]',
	agencyId            : '[Agency ID]',
	clientId            : '[Client ID]',
	payerId             : '[Client ID Payer]',
	jobRef              : '[Job Ref]',
	serviceStartDate    : '[Service Start Date]',
	serviceFinishDate   : '[Service Finish Date]',
	comments            : '[Comments]',
	agencysClient       : '[Agencys Client]',
	cardId              : '[Card ID]',
	budget              : '[Budget]',
	budgetWarningLevel  : '[Budget Warning Level]',
	budgetRef           : '[Budget Ref]',
	agencyContactId     : '[Agency Contact ID]',
	purchaseOrderNumber : '[PO Number]',
	agencyProgramId     : '[AgencyProgramNo]',
};

const dateFields = [ '[Service Start Date]', '[Service Finish Date]' ];

async function getFundingArrangements(user, queryParams) {
	console.log('DB:getFundingArrangements(user, queryParams)');
	const agencyId = queryParams.agencyId;
	const clientId = queryParams.clientId;
	const activeOnly = queryParams.activeOnly;

	agencyId && console.log(`agencyId: ${agencyId}`);
	clientId && console.log(`clientId: ${clientId}`);
	activeOnly && console.log(`activeOnly: ${queryParams.activeOnly}`);

	let query = `SELECT 
			AC.[SeqNo] AS id,
			AC.[Client ID] AS clientId,
			C.[First Name] + ' ' + C.[Last Name] AS clientName,
			AC.[Client ID Payer] AS payerId,
			AC.[Agency ID] AS agencyId,
			AC.[AgencyProgramNo] AS agencyProgramId,
			
			CASE 
				WHEN AC.[AgencyProgramNo] IS NOT NULL THEN RTRIM(A.[Company]) + ', ' + AP2.[ProgramName]
				WHEN AC.[Agency ID] IS NOT NULL THEN RTRIM(A.[Company]) 
				WHEN AC.[Client ID Payer] IS NOT NULL THEN RTRIM(P.[First Name] + ' ' + P.[Last Name]) 
				ELSE RTRIM(C.[First Name] + ' ' + C.[Last Name])
			END 
			AS name,

			AC.[Agency Contact ID] AS agencyContactId,
			RTRIM(S.[FirstName] + ' ' + S.[SurName]) AS agencyContactName,

			CASE 
				WHEN AP2.[Agency Contact ID] IS NOT NULL THEN APC.[Direct Phone]
				WHEN AC.[Agency Contact ID] IS NOT NULL THEN S.[Direct Phone]
				WHEN AC.[Agency ID] IS NOT NULL THEN A.[Business Phone]
				WHEN AC.[Client ID Payer] IS NOT NULL THEN P.[Home Phone]
				ELSE C.[Home Phone]
			END 
			AS phone,
			CASE 
				WHEN AP2.[Agency Contact ID] IS NOT NULL THEN APC.[Mobile Phone]
				WHEN AC.[Agency Contact ID] IS NOT NULL THEN S.[Mobile Phone]
				WHEN AC.[Agency ID] IS NOT NULL THEN A.[Mobile Phone]
				WHEN AC.[Client ID Payer] IS NOT NULL THEN P.[Mobile Phone]
				ELSE C.[Mobile Phone]
			END 
			AS mobile,
			CASE 
				WHEN AP2.[Agency Contact ID] IS NOT NULL THEN APC.[Email]
				WHEN AC.[Agency Contact ID] IS NOT NULL THEN S.[Email]
				WHEN AC.[Agency ID] IS NOT NULL THEN A.[E-mail Address]
				WHEN AC.[Client ID Payer] IS NOT NULL THEN P.[E-mail Address]
				ELSE C.[E-mail Address]
			END 
			AS email,

			AC.[Job Ref] AS jobRef,
			AC.[Agencys Client] AS agencysClient,
			--STUFF((SELECT ', ' + RTRIM(T.[Task Name]) FROM Tasks T JOIN [Agencies Clients Tasks] ACT ON ACT.[TASK ID] = T.[ID] WHERE ACT.[AgencyClientSeqNo] = AC.[SeqNo] AND ACT.Obsolete=0 ORDER BY T.[Task Name] FOR XML PATH('')), 1, 2, '') AS tasks,
			AC.[Card ID] AS cardId,
			AC.[Budget] AS budget,
			AC.[Budget Warning Level] AS budgetWarningLevel,
			AC.[Budget Ref] AS budgetRef,
			AC.[PO Number] AS purchaseOrderNumber,
			${dateTimeUtil.dbDate2utcDate('AC.[Service Start Date]', user.companyTimezone)} AS serviceStartDate,
			${dateTimeUtil.dbDate2utcDate('AC.[Service Finish Date]', user.companyTimezone)} AS serviceFinishDate,
			AC.[Comments] AS comments,

			CASE
				WHEN AC.[Agency ID] IS NOT NULL THEN 'Agency'
				ELSE 'Client'
			END
			AS fundingSourceType,
			CASE
				WHEN AC.[Agency ID] IS NOT NULL THEN 'A' + CAST(AC.[Agency ID] AS VARCHAR(10))
				WHEN AC.[Client ID Payer] IS NOT NULL THEN 'C' + CAST(AC.[Client ID Payer] AS VARCHAR(10))
				ELSE 'C' + CAST([Client ID] AS VARCHAR(10))
			END
			AS fundingSourceId,

			CASE
				WHEN AC.[Agency ID] IS NOT NULL THEN AP.[PricingGroupName]
				WHEN AC.[Client ID Payer] IS NOT NULL THEN PP.[PricingGroupName]
				ELSE CP.[PricingGroupName] 
			END
			AS pricingGroupName

		FROM [Agencies Clients] AC
			LEFT JOIN CLIENTS C ON C.ID = AC.[Client ID]
			LEFT JOIN [Ref Pricing Groups] CP ON CP.[PricingGroupNo] = C.PricingGroupNo
			LEFT JOIN Agencies A ON A.ID = AC.[Agency ID]
			LEFT JOIN [Ref Pricing Groups] AP ON AP.[PricingGroupNo] = A.PricingGroupNo
			LEFT JOIN CLIENTS P ON P.ID = AC.[Client ID Payer]
			LEFT JOIN [Ref Pricing Groups] PP ON PP.[PricingGroupNo] = P.PricingGroupNo
			LEFT JOIN [Agencies Contacts] S ON S.[Contact ID] = AC.[Agency Contact ID]
			LEFT JOIN [Agencies Programs] AP2 ON AP2.[AgencyProgramNo] = AC.[AgencyProgramNo]
			LEFT JOIN [Agencies Contacts] APC ON APC.[Contact ID] = AP2.[Agency Contact ID] `;

	if (agencyId) {
		query += `WHERE A.ID = ${agencyId} AND A.[CompanyId] = ${user.companyId} `;
	}
	if (clientId) {
		query += `WHERE C.ID = ${clientId} AND C.[CompanyId] = ${user.companyId} `;
	}

	if (activeOnly != undefined) {
		query += 'AND (AC.[Service Finish Date] IS NULL OR AC.[Service Finish Date] > GETDATE()) ';
		if (agencyId) {
			// if querying from Agency perspective consider if the Client is also active
			query += `AND (C.[Service Finish Date] IS NULL OR (C.[Service Finish Date] > GetDate())) AND C.Deceased = 0 `;
		}
	}

	if (agencyId) {
		query += 'ORDER BY clientName';
	}
	if (clientId) {
		query += 'ORDER BY name';
	}

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getFundingArrangements = getFundingArrangements;

async function getFundingArrangement(user, fundingArrangementId) {
	console.log('DB:getFundingArrangement(user, fundingArrangementId)');

	let query = `SELECT 
			AC.[SeqNo] AS id,
			AC.[Client ID] AS clientId,
			AC.[Client ID Payer] AS payerId,
			AC.[Agency ID] AS agencyId,
			AC.[AgencyProgramNo] AS agencyProgramId,
			
			CASE 
				WHEN AC.[AgencyProgramNo] IS NOT NULL THEN RTRIM(A.[Company]) + ', ' + AP2.[ProgramName]
				WHEN AC.[Agency ID] IS NOT NULL THEN RTRIM(A.[Company]) 
				WHEN AC.[Client ID Payer] IS NOT NULL THEN RTRIM(P.[First Name] + ' ' + P.[Last Name]) 
				ELSE RTRIM(C.[First Name] + ' ' + C.[Last Name])
			END 
			AS name,

			AC.[Agency Contact ID] AS agencyContactId,
			RTRIM(S.[FirstName] + ' ' + S.[SurName]) AS agencyContactName,

			CASE 
				WHEN AP2.[Agency Contact ID] IS NOT NULL THEN APC.[Direct Phone]
				WHEN AC.[Agency Contact ID] IS NOT NULL THEN S.[Direct Phone]
				WHEN AC.[Agency ID] IS NOT NULL THEN A.[Business Phone]
				WHEN AC.[Client ID Payer] IS NOT NULL THEN P.[Home Phone]
				ELSE C.[Home Phone]
			END 
			AS phone,
			CASE 
				WHEN AP2.[Agency Contact ID] IS NOT NULL THEN APC.[Mobile Phone]
				WHEN AC.[Agency Contact ID] IS NOT NULL THEN S.[Mobile Phone]
				WHEN AC.[Agency ID] IS NOT NULL THEN A.[Mobile Phone]
				WHEN AC.[Client ID Payer] IS NOT NULL THEN P.[Mobile Phone]
				ELSE C.[Mobile Phone]
			END 
			AS mobile,
			CASE 
				WHEN AP2.[Agency Contact ID] IS NOT NULL THEN APC.[Email]
				WHEN AC.[Agency Contact ID] IS NOT NULL THEN S.[Email]
				WHEN AC.[Agency ID] IS NOT NULL THEN A.[E-mail Address]
				WHEN AC.[Client ID Payer] IS NOT NULL THEN P.[E-mail Address]
				ELSE C.[E-mail Address]
			END 
			AS email,

			AC.[Job Ref] AS jobRef,
			AC.[Agencys Client] AS agencysClient,
			--STUFF((SELECT ', ' + RTRIM(T.[Task Name]) FROM Tasks T JOIN [Agencies Clients Tasks] ACT ON ACT.[TASK ID] = T.[ID] WHERE ACT.[AgencyClientSeqNo] = AC.[SeqNo] AND ACT.Obsolete=0 ORDER BY T.[Task Name] FOR XML PATH('')), 1, 2, '') AS tasks,
			AC.[Card ID] AS cardId,
			AC.[Budget] AS budget,
			AC.[Budget Warning Level] AS budgetWarningLevel,
			AC.[Budget Ref] AS budgetRef,
			AC.[PO Number] AS purchaseOrderNumber,
			${dateTimeUtil.dbDate2utcDate('AC.[Service Start Date]', user.companyTimezone)} AS serviceStartDate,
			${dateTimeUtil.dbDate2utcDate('AC.[Service Finish Date]', user.companyTimezone)} AS serviceFinishDate,
			AC.[Comments] AS comments,

			CASE
				WHEN AC.[Agency ID] IS NOT NULL THEN 'Agency'
				ELSE 'Client'
			END
			AS fundingSourceType,
			CASE
				WHEN AC.[Agency ID] IS NOT NULL THEN 'A' + CAST(AC.[Agency ID] AS VARCHAR(10))
				WHEN AC.[Client ID Payer] IS NOT NULL THEN 'C' + CAST(AC.[Client ID Payer] AS VARCHAR(10))
				ELSE 'C' + CAST([Client ID] AS VARCHAR(10))
			END
			AS fundingSourceId,

			CASE
				WHEN AC.[Agency ID] IS NOT NULL THEN AP.[PricingGroupName]
				WHEN AC.[Client ID Payer] IS NOT NULL THEN PP.[PricingGroupName]
				ELSE CP.[PricingGroupName] 
			END
			AS pricingGroupName

		FROM [Agencies Clients] AC
			LEFT JOIN CLIENTS C ON C.ID = AC.[Client ID]
			LEFT JOIN [Ref Pricing Groups] CP ON CP.[PricingGroupNo] = C.PricingGroupNo
			LEFT JOIN Agencies A ON A.ID = AC.[Agency ID]
			LEFT JOIN [Ref Pricing Groups] AP ON AP.[PricingGroupNo] = A.PricingGroupNo
			LEFT JOIN CLIENTS P ON P.ID = AC.[Client ID Payer]
			LEFT JOIN [Ref Pricing Groups] PP ON PP.[PricingGroupNo] = P.PricingGroupNo
			LEFT JOIN [Agencies Contacts] S ON S.[Contact ID] = AC.[Agency Contact ID]
			LEFT JOIN [Agencies Programs] AP2 ON AP2.[AgencyProgramNo] = AC.[AgencyProgramNo]
			LEFT JOIN [Agencies Contacts] APC ON APC.[Contact ID] = AP2.[Agency Contact ID]
        WHERE [SeqNo] = ${fundingArrangementId}`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getFundingArrangement = getFundingArrangement;

async function updateFundingArrangement(user, fundingArrangementId, fundingArrangement) {
	console.log('DB:updateFundingArrangement(user, fundingArrangementId, fundingArrangement)');

	if (fundingArrangement.fundingSourceId) {
		if (fundingArrangement.fundingSourceId[0] === 'A') {
			fundingArrangement.agencyId = parseInt(fundingArrangement.fundingSourceId.substring(1));
			fundingArrangement.payerId = null;
		}
		if (fundingArrangement.fundingSourceId[0] === 'C') {
			fundingArrangement.agencyId = null;
			fundingArrangement.payerId = parseInt(fundingArrangement.fundingSourceId.substring(1));
		}
	}

	let fields = [];
	for (let [ key, value ] of Object.entries(fundingArrangement)) {
		console.log(key, value);

		const dbFieldName = dbField[key];
		if (dbFieldName && dbFieldName !== '[SeqNo]') {
			if (typeof value === 'string') value = `'${value}'`; // strings need to single quoted in SQL
			if (typeof value === 'boolean') value = value ? 1 : 0; // booleans need to be translated from true/false to 1/0 in SQL
			if (dateFields.includes(dbFieldName)) value = dateTimeUtil.utcDate2dbDate(value, user.companyTimezone); // Dates (without time) need to be rounded from UTC to nearest date

			fields.push(`${dbFieldName}=${value}`);
		}
	}
	const fieldList = fields.join();

	let stmt = database.startTransaction;

	// update [Agencies Clients] record
	if (fieldList.length) {
		stmt += `UPDATE [Agencies Clients] SET ${fieldList} WHERE [SeqNo]=${fundingArrangementId}`;
	}

	// update [Agencies Clients Tasks] records
	if (fundingArrangement.tasks) {
		const newTasks = fundingArrangement.tasks;

		const query = `SELECT [AgencyClientTaskNo] AS id, [Task ID] AS taskId FROM [Agencies Clients Tasks] WHERE [AgencyClientSeqNo] = ${fundingArrangementId}`;
		const result = await database.simpleExecute(query);
		const oldTasks = result.recordset;
		const keepTasks = [];

		// Determine which tasks need to be deleted
		for (let i = 0; i < oldTasks.length; i++) {
			if (newTasks.includes(oldTasks[i].taskId) === false) {
				//const oldTask = oldTasks[i];
				stmt += `DELETE FROM [Agencies Clients Tasks] WHERE [AgencyClientTaskNo] = ${oldTasks[i].id}\n`;
			} else {
				keepTasks.push(oldTasks[i].taskId);
			}
		}

		// Determine which tasks need to be inserted
		for (let i = 0; i < newTasks.length; i++) {
			if (keepTasks.includes(newTasks[i]) === false) {
				//const newTask = newTasks[i];
				stmt += `INSERT INTO [Agencies Clients Tasks] ([AgencyClientSeqNo], [Task ID]) 
				         VALUES (${fundingArrangementId}, ${newTasks[i]})\n`;
			}
		}
	}

	stmt += database.endTransaction;

	console.log(stmt);
	const result = await database.simpleExecute(stmt);
	//console.log(result);
	return result;
}
module.exports.updateFundingArrangement = updateFundingArrangement;

async function addFundingArrangement(user, fundingArrangement) {
	console.log('DB:addFundingArrangement(user, fundingArrangement)');

	// clientId is mandatory
	if (fundingArrangement.clientId === undefined) {
		console.log('Client ID is Mandatory');
		return { message: 'Client ID is Mandatory' };
	}
	// serviceStartDate is mandatory
	if (fundingArrangement.serviceStartDate === undefined) {
		console.log('Service Start Date is Mandatory');
		return { message: 'Service Start Date is Mandatory' };
	}
	if (fundingArrangement.fundingSourceId) {
		if (fundingArrangement.fundingSourceId[0] === 'A')
			fundingArrangement.agencyId = parseInt(fundingArrangement.fundingSourceId.substring(1));
		if (fundingArrangement.fundingSourceId[0] === 'C')
			fundingArrangement.payerId = parseInt(fundingArrangement.fundingSourceId.substring(1));
	}
	if (fundingArrangement.agencyId === undefined && fundingArrangement.payerId === undefined) {
		console.log('Either an Agency ID or Payer ID must be supplied');
		return { message: 'Either an Agency ID or Payer ID must be supplied' };
	}
	if (fundingArrangement.agencyId) {
		const query = `SELECT [SeqNo] AS id 
				FROM [Agencies Clients] 
				WHERE [Client ID] = ${fundingArrangement.clientId}
                  AND [Agency ID] = ${fundingArrangement.agencyId}`;

		console.log(query);
		let result = await database.simpleExecute(query);

		if (result.recordset.length === 1) {
			console.log('Duplicate record detected');
			return { message: 'Duplicate record detected' };
		}
	}
	if (fundingArrangement.payerId) {
		const query = `SELECT [SeqNo] AS id 
				FROM [Agencies Clients] 
				WHERE [Client ID] = ${fundingArrangement.clientId}
                  AND [Client ID Payer] = ${fundingArrangement.payerId}`;

		console.log(query);
		let result = await database.simpleExecute(query);

		if (result.recordset.length === 1) {
			console.log('Duplicate record detected');
			return { message: 'Duplicate record detected' };
		}
	}

	let fields = [];
	let values = [];
	for (let [ key, value ] of Object.entries(fundingArrangement)) {
		console.log(key, value);

		const dbFieldName = dbField[key];
		if (value && dbFieldName && dbFieldName !== '[SeqNo]') {
			if (typeof value === 'string') value = `'${value}'`; // strings need to single quoted in SQL
			if (typeof value === 'boolean') value = value ? 1 : 0; // booleans need to be translated from true/false to 1/0 in SQL
			if (dateFields.includes(dbFieldName)) value = dateTimeUtil.utcDate2dbDate(value, user.companyTimezone); // Dates (without time) need to be rounded from UTC to nearest date

			fields.push(dbFieldName);
			values.push(value);
		}
	}
	const fieldList = fields.join();
	const valueList = values.join();

	//  Start transaction
	let stmt = database.startTransaction;

	// Insert [Agencies Clients] record
	stmt += `DECLARE @agencyClientId INT;\n`;
	stmt += `INSERT INTO [Agencies Clients] (${fieldList}) OUTPUT INSERTED.[SeqNo] AS id VALUES (${valueList});\n`;
	stmt += `SET @agencyClientId = @@IDENTITY;\n`;

	// iterate through tasks array
	if (fundingArrangement.tasks) {
		for (let i = 0; i < fundingArrangement.tasks.length; i++) {
			const task = fundingArrangement.tasks[i];
			stmt += `INSERT INTO [Agencies Clients Tasks] ([AgencyClientSeqNo], [Task ID]) OUTPUT INSERTED.[AgencyClientTaskNo] AS id VALUES (@agencyClientId, ${task});\n`;
		}
	}

	// End transaction and catch errors
	stmt += database.endTransaction;

	console.log(stmt);
	result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}
module.exports.addFundingArrangement = addFundingArrangement;

async function deleteFundingArrangement(user, fundingArrangementId) {
	console.log('DB:deleteFundingArrangement(user, fundingArrangementId)');

	// Start transaction
	let stmt = database.startTransaction;

	// Delete [Agencies Clients Skills] records (if any)
	stmt += `
	DECLARE @taskCount INT = (SELECT COUNT(*) AS count FROM [Agencies Clients Tasks] WHERE [AgencyClientSeqNo] = ${fundingArrangementId})
	IF (@taskCount > 0)
		BEGIN
			DELETE FROM [Agencies Clients Tasks] OUTPUT DELETED.[AgencyClientTaskNo] AS id WHERE [AgencyClientSeqNo] = ${fundingArrangementId}
		END\n`;

	// Delete [Agencies Clients] record
	stmt += `DELETE FROM [Agencies Clients] OUTPUT DELETED.[SeqNo] AS id WHERE [SeqNo] = ${fundingArrangementId}\n`;

	// Finish transaction
	stmt += database.endTransaction;

	console.log(stmt);
	const result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}
module.exports.deleteFundingArrangement = deleteFundingArrangement;
