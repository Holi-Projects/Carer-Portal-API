const database = require('../services/database.js');
const dateTimeUtil = require('../utils/dateTimeUtil');

const dbField = {
	id                   : '[CarerSkillNo]',
	carerId              : '[Carer ID]',
	skillId              : '[SkillNo]',
	dateGained           : '[Date Gained]',
	expiryDate           : '[Expiry Date]',
	referenceNo          : '[Reference No]',
	comments             : '[Comments]',
	carerSubmittedDate   : '[DateCarerSubmitted]',
	approvedDate         : '[DateApproved]',
	approvedByEmployeeId : '[ApprovedByEmployeeID]',
};

const dateFields = [ '[Date Gained]', '[Expiry Date]', '[DateCarerSubmitted]', '[DateApproved]' ];

async function getList(user, carerId) {
	console.log('DB:carerSkill.getList(user, carerId)');
	console.log(`carerId: ${carerId}`);

	let query = ``;
	if (carerId !== undefined) {
		query = `SELECT 
				CS.[CarerSkillNo] AS id,
				CS.[SkillNo] AS skillId,
				S.[Skill Name] AS name,
				S.[Skill Description] AS description,
				S.[Has Expiry Date] AS hasExpiryDate,
				${dateTimeUtil.dbDate2utcDate('CS.[Date Gained]', user.companyTimezone)} AS dateGained,
				${dateTimeUtil.dbDate2utcDate('CS.[Expiry Date]', user.companyTimezone)} AS expiryDate,
				CS.[Reference No] AS referenceNo,
				CS.[Comments] AS comments,
				${dateTimeUtil.dbDate2utcDate('CS.[DateCarerSubmitted]', user.companyTimezone)} AS carerSubmittedDate,
				${dateTimeUtil.dbDate2utcDate('CS.[DateApproved]', user.companyTimezone)} AS approvedDate,
				CS.[ApprovedByEmployeeID] AS approvedByEmployeeId,
				E.[First Name] + ' ' + E.[Last Name] AS approvedByEmployeeName
			FROM [Carers Skills] CS 
			JOIN [Skills] S ON S.[SkillNo] = CS.[SkillNo]
			JOIN [Carers] C ON C.[ID] = CS.[Carer ID]
			LEFT JOIN [Employees] E ON E.[ID] = CS.[approvedByEmployeeId]
			WHERE C.[ID] = ${carerId} AND C.[CompanyId] = ${user.companyId}
			ORDER BY S.[Skill Name]`;
	}

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getList = getList;

async function get(user, carerId, id) {
	console.log('DB:carerSkill.get(user, carerId, id)');
	console.log(`carerId: ${carerId}`);
	console.log(`id: ${id}`);

	let query = ``;
	if (carerId !== undefined && id !== undefined) {
		query = `SELECT 
				CS.[CarerSkillNo] AS id,
				CS.[SkillNo] AS skillId,
				${dateTimeUtil.dbDate2utcDate('CS.[Date Gained]', user.companyTimezone)} AS dateGained,
				${dateTimeUtil.dbDate2utcDate('CS.[Expiry Date]', user.companyTimezone)} AS expiryDate,
				CS.[Reference No] AS referenceNo,
				CS.[Comments] AS comments,
				${dateTimeUtil.dbDate2utcDate('CS.[DateCarerSubmitted]', user.companyTimezone)} AS carerSubmittedDate,
				${dateTimeUtil.dbDate2utcDate('CS.[DateApproved]', user.companyTimezone)} AS approvedDate,
				CS.[ApprovedByEmployeeID] AS approvedByEmployeeId
			FROM [Carers Skills] CS 
			JOIN [Carers] C ON C.[ID] = CS.[Carer ID]
            WHERE CS.[CarerSkillNo] = ${id} 
              AND C.[ID] = ${carerId} 
              AND C.[CompanyId] = ${user.companyId}`;
	}

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.get = get;

async function update(user, carerId, id, data) {
	console.log('DB:carerSkill.update(user, carerId, id, data)');

	let fields = [];
	for (let [ key, value ] of Object.entries(data)) {
		console.log(key, value);

		const dbFieldName = dbField[key];
		if (dbFieldName && dbFieldName !== '[CarerSkillNo]') {
			if (typeof value === 'string') value = `'${value}'`; // strings need to single quoted in SQL
			if (typeof value === 'boolean') value = value ? 1 : 0; // booleans need to be translated from true/false to 1/0 in SQL
			if (dateFields.includes(dbFieldName)) value = dateTimeUtil.utcDate2dbDate(value, user.companyTimezone);

			fields.push(`${dbFieldName}=${value}`);
		}
	}
	const fieldList = fields.join();

	const query = `UPDATE [Carers Skills] 
                        SET ${fieldList}
                     WHERE [CarerSkillNo] = ${id} 
                       AND [Carer ID] = ${carerId}`;

	console.log(query);

	const result = await database.simpleExecute(query);
	//console.log(result);
	return result;
}
module.exports.update = update;

async function insert(user, data) {
	console.log('DB:carerSkill.insert(user, data)');

	// TODO: Duplicate Detection -- rules need to be defined.

	let fields = [];
	let values = [];
	for (let [ key, value ] of Object.entries(data)) {
		console.log(key, value);

		const dbFieldName = dbField[key];
		if (value && dbFieldName && dbFieldName !== '[CarerSkillNo]') {
			if (typeof value === 'string') value = `'${value}'`; // strings need to single quoted in SQL
			if (typeof value === 'boolean') value = value ? 1 : 0; // booleans need to be translated from true/false to 1/0 in SQL
			if (dateFields.includes(dbFieldName)) value = dateTimeUtil.utcDate2dbDate(value, user.companyTimezone);

			fields.push(dbFieldName);
			values.push(value);
		}
	}
	const fieldList = fields.join();
	const valueList = values.join();

	const stmt = `INSERT INTO [Carers Skills] (${fieldList}) OUTPUT INSERTED.[CarerSkillNo] AS id VALUES (${valueList});`;

	console.log(stmt);
	result = await database.simpleExecute(stmt);
	console.log(result);
	/*} else {
		console.log('Duplicate detected');
	}*/
	return result;
}
module.exports.insert = insert;

async function remove(user, carerId, id) {
	console.log('DB:carerSkill.remove(user, carerId, id)');

	let query = `DELETE FROM [Carers Skills] 
        OUTPUT DELETED.[CarerSkillNo] AS id 
        WHERE [Carer ID] = ${carerId}
        AND [CarerSkillNo] = ${id}`;

	console.log(query);
	const result = await database.simpleExecute(query);
	console.log(result);
	return result;
}
module.exports.remove = remove;

async function approve(user, carerId, id) {
	console.log('DB:carerSkill.approve(user, carerId, id)');
	console.log(`carerId: ${carerId}`);
	console.log(`id: ${id}`);

	const query = `UPDATE [Carers Skills] SET
				[DateApproved] = GETDATE(),
				[ApprovedByEmployeeID] = ${user.userId}
				WHERE [CarerSkillNo] = ${id} 
                  AND [Carer ID] = ${carerId}`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result;
}
module.exports.approve = approve;
