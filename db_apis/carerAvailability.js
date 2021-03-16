const database = require('../services/database.js');
const dateTimeUtil = require('../utils/dateTimeUtil');

const dbField = {
	id                      : '[Seq No]',
	carerId                 : '[Carer ID]',
	weekDay                 : '[WeekDay]',
	startTime               : '[Start Time]',
	endTime                 : '[End Time]',
	available24hrShift      : '[Available 24hr Shift]',
	availableOvernightShift : '[Available Overnight Shift]',
	comments                : '[Comments]',
};

const timeFields = [ '[Start Time]', '[End Time]' ];

async function getList(user, carerId) {
	console.log('DB:carerAvailability.getList(user, carerId)');
	console.log(`carerId: ${carerId}`);

	let query = ``;
	if (carerId !== undefined) {
		// Get carer availability by carer id
		query = `SELECT A.[Seq No] AS id,
					A.[WeekDay] AS weekDay,
					CASE A.[WeekDay]
						WHEN 1 THEN 'Sunday'
						WHEN 2 THEN 'Monday'
						WHEN 3 THEN 'Tuesday'
						WHEN 4 THEN 'Wednesday'
						WHEN 5 THEN 'Thursday'
						WHEN 6 THEN 'Friday'
						WHEN 7 THEN 'Saturday'
					END AS day,
					${dateTimeUtil.dbTime2utcDate('A.[Start Time]', user.companyTimezone)} AS startTime,
					${dateTimeUtil.dbTime2utcDate('A.[End Time]', user.companyTimezone)} AS endTime,
					A.[Available 24hr Shift] AS available24hrShift,
					A.[Available Overnight Shift] AS availableOvernightShift,
					A.[Comments] AS comments
				FROM [Carers Availability] A
				JOIN [Carers] C ON C.[ID] = A.[Carer ID]
				WHERE A.[Carer ID] = ${carerId}
				  AND A.[WeekDay] IS NOT NULL 
				  AND C.[CompanyId] = ${user.companyId} 
				ORDER BY A.[WeekDay], A.[Start Time]`;
	}

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getList = getList;

async function get(user, carerId, id) {
	console.log('DB:carerAvailability.get(user, carerId, id)');
	console.log(`carerId: ${carerId}`);
	console.log(`id: ${id}`);

	let query = ``;
	if (carerId !== undefined && id !== undefined) {
		query = `SELECT 
                A.[Seq No] AS id,
                A.[WeekDay] AS weekDay,
                ${dateTimeUtil.dbTime2utcDate('A.[Start Time]', user.companyTimezone)} AS startTime,
                ${dateTimeUtil.dbTime2utcDate('A.[End Time]', user.companyTimezone)} AS endTime,
                A.[Available 24hr Shift] AS available24hrShift,
                A.[Available Overnight Shift] AS availableOvernightShift,
                A.[Comments] AS comments
            FROM [Carers Availability] A
            JOIN [Carers] C ON C.[ID] = A.[Carer ID]
            WHERE A.[Seq No] = ${id}
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
	console.log('DB:carerAvailability.update(user, carerId, id, data)');

	let fields = [];
	for (let [ key, value ] of Object.entries(data)) {
		console.log(key, value);

		const dbFieldName = dbField[key];
		if (dbFieldName && dbFieldName !== '[Seq No]') {
			if (typeof value === 'string') value = `'${value}'`; // strings need to single quoted in SQL
			if (typeof value === 'boolean') value = value ? 1 : 0; // booleans need to be translated from true/false to 1/0 in SQL
			if (timeFields.includes(dbFieldName)) value = dateTimeUtil.utcDate2dbTime(value, user.companyTimezone);

			fields.push(`${dbFieldName}=${value}`);
		}
	}
	const fieldList = fields.join();

	const query = `UPDATE [Carers Availability] 
                        SET ${fieldList}
                     WHERE [Seq No] = ${id} 
                       AND [Carer ID] = ${carerId}`;

	console.log(query);

	const result = await database.simpleExecute(query);
	//console.log(result);
	return result;
}
module.exports.update = update;

async function insert(user, data) {
	console.log('DB:carerAvailability.insert(user, data)');

	// Duplicate Detection
	if (data.weekDay === undefined) {
		console.log('Week Day is Mandatory');
		return { message: 'Week Day is Mandatory' };
	} else if (data.weekDay < 1 || data.weekDay > 7) {
		console.log('Week Day must be between 1 and 7');
		return { message: 'Week Day must be between 1 and 7' };
	}
	// check if start time and end time are set or available 24hr or available overnight...
	// check if start time before end time...
	// check for time overlap...
	// check for available 24 hr duplicate...
	// chekc for available overnight duplicate...

	/*const query = `SELECT 
					[Contact ID] AS id 
				FROM [Agencies Contacts] 
                WHERE [FirstName] = '${agencyContact.firstName}'
                  AND [SurName] = '${agencyContact.lastName}'
				  AND [Agency ID] = ${agencyContact.agencyId}`;

	console.log(query);
	let result = await database.simpleExecute(query);

	if (result.recordset.length === 0) {*/
	let fields = [];
	let values = [];
	for (let [ key, value ] of Object.entries(data)) {
		console.log(key, value);

		const dbFieldName = dbField[key];
		if (value && dbFieldName && dbFieldName !== '[Seq No]') {
			if (typeof value === 'string') value = `'${value}'`; // strings need to single quoted in SQL
			if (typeof value === 'boolean') value = value ? 1 : 0; // booleans need to be translated from true/false to 1/0 in SQL
			if (timeFields.includes(dbFieldName)) value = dateTimeUtil.utcDate2dbTime(value, user.companyTimezone);

			fields.push(dbFieldName);
			values.push(value);
		}
	}
	const fieldList = fields.join();
	const valueList = values.join();

	const stmt = `INSERT INTO [Carers Availability] (${fieldList}) OUTPUT INSERTED.[Seq No] AS id VALUES (${valueList});`;

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
	console.log('DB:carerAvailability.remove(user, carerId, id)');

	let query = `DELETE FROM [Carers Availability] 
        OUTPUT DELETED.[Seq No] AS id 
        WHERE [Carer ID] = ${carerId}
        AND [Seq No] = ${id}`;

	console.log(query);
	const result = await database.simpleExecute(query);
	console.log(result);
	return result;
}
module.exports.remove = remove;
