const database = require('../services/database.js');
const dateTimeUtil = require('../utils/dateTimeUtil');

const dbField = {
	id           : '[Carer Doc Seq No]',
	carerId      : '[Carer ID]',
	name         : '[Carer Doc Name]',
	incidentId   : '[IncidentNo]',
	carerSkillId : '[CarerSkillNo]',
};

const dateFields = [];

async function getList(user, carerId, queryParams) {
	console.log('DB:carerDocument.getList(user, carerId)');
	console.log(`carerId: ${carerId}`);

	let query = ``;
	if (carerId !== undefined) {
		query = `SELECT
                CD.[Carer Doc Seq No] AS id,
                CD.[Carer ID] AS carerId,
                CD.[Carer Doc Name] AS name,
                CD.[IncidentNo] AS incidentId,
                CD.[CarerSkillNo] AS carerSkillId
			FROM [Carers Documents] CD 
			JOIN [Carers] C ON C.[ID] = CD.[Carer ID]
			WHERE C.[ID] = ${carerId} 
			  AND C.[CompanyID] = ${user.companyId} `;

		if (queryParams.incidentId != undefined) {
			query += `AND [IncidentNo] = ${parseInt(queryParams.incidentId)} `;
		} else {
			query += `AND [IncidentNo] IS NULL `;
		}

		if (queryParams.carerSkillId != undefined) {
			query += `AND [CarerSkillNo] = ${parseInt(queryParams.carerSkillId)} `;
		} else {
			query += `AND [CarerSkillNo] IS NULL `;
		}

		query += `ORDER BY CD.[Carer Doc Name]`;
	}

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getList = getList;

async function get(user, carerId, id) {
	console.log('DB:carerDocument.get(user, carerId, id)');
	console.log(`carerId: ${carerId}`);
	console.log(`id: ${id}`);

	let query = ``;
	if (carerId !== undefined && id !== undefined) {
		query = `SELECT
                CD.[Carer Doc Seq No] AS id,
                CD.[Carer ID] AS carerId,
                CD.[Carer Doc Name] AS name,
                CD.[IncidentNo] AS incidentId,
                CD.[CarerSkillNo] AS carerSkillId
            FROM [Carers Documents] CD 
            JOIN [Carers] C ON C.[ID] = CD.[Carer ID]
            WHERE CD.[Carer Doc Seq No] = ${id} 
              AND C.[ID] = ${carerId} 
              AND C.[CompanyID] = ${user.companyId}`;
	}

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.get = get;

async function update(user, carerId, id, data) {
	console.log('DB:carerDocument.update(user, carerId, id, data)');

	let fields = [];
	for (let [ key, value ] of Object.entries(data)) {
		console.log(key, value);

		const dbFieldName = dbField[key];
		if (dbFieldName && dbFieldName !== '[Carer Doc Seq No]') {
			if (typeof value === 'string') value = `'${value}'`; // strings need to single quoted in SQL
			if (typeof value === 'boolean') value = value ? 1 : 0; // booleans need to be translated from true/false to 1/0 in SQL
			if (dateFields.includes(dbFieldName)) value = dateTimeUtil.utcDate2dbDate(value, user.companyTimezone);

			fields.push(`${dbFieldName}=${value}`);
		}
	}
	const fieldList = fields.join();

	const query = `UPDATE [Carers Documents] 
                        SET ${fieldList}
                     WHERE [Carer Doc Seq No] = ${id} 
                       AND [Carer ID] = ${carerId}`;

	console.log(query);

	const result = await database.simpleExecute(query);
	//console.log(result);
	return result;
}
module.exports.update = update;

async function insert(user, data) {
	console.log('DB:carerDocument.insert(user, data)');

	const res = { success: false };

	// Check mandatory fields
	if (data.carerId === undefined) {
		res.message = 'Carer ID is mandatory';
		return res;
	}
	if (data.name === undefined) {
		res.message = 'File Name is mandatory';
		return res;
	}

	// TODO: Duplicate Detection -- rules need to be defined.
	// XXXX duplicate detection on name, name and IncidentNo or name and CareSkillNo.
	let query = `SELECT 
			[Carer Doc Seq No] AS id 
		FROM [Carers Documents]
		WHERE [Carer ID] = ${data.carerId}
		  AND [Carer Doc Name] = '${data.name}'`;

	if (data.carerSkillId) query += ` AND [CarerSkillNo] = ${data.carerSkillId}`;

	if (data.incidentId) query += ` And [IncidentNo] = ${datat.incidentId}`;

	console.log(query);
	let result = await database.simpleExecute(query);
	if (result.recordset.length > 0) {
		res.message = 'Duplicate detected';
		res.id = result.recordset[0].id;
		return res;
	}

	// Insert record
	let fields = [];
	let values = [];
	for (let [ key, value ] of Object.entries(data)) {
		console.log(key, value);

		const dbFieldName = dbField[key];
		if (value && dbFieldName && dbFieldName !== '[Carer Doc Seq No]') {
			if (typeof value === 'string') value = `'${value}'`; // strings need to single quoted in SQL
			if (typeof value === 'boolean') value = value ? 1 : 0; // booleans need to be translated from true/false to 1/0 in SQL
			if (dateFields.includes(dbFieldName)) value = dateTimeUtil.utcDate2dbDate(value, user.companyTimezone);

			fields.push(dbFieldName);
			values.push(value);
		}
	}
	const fieldList = fields.join();
	const valueList = values.join();

	const stmt = `INSERT INTO [Carers Documents] (${fieldList}) OUTPUT INSERTED.[Carer Doc Seq No] AS id VALUES (${valueList});`;

	console.log(stmt);
	result = await database.simpleExecute(stmt);
	console.log(result);

	if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
		res.success = true;
		res.message = 'Carers Document inserted successfully';
		res.id = result.recordset[0].id;
		return res;
	}

	res.message = 'Insert failed';
	return res;
}
module.exports.insert = insert;

async function remove(user, carerId, id) {
	console.log('DB:carerDocument.remove(user, carerId, id)');

	let query = `DELETE FROM [Carers Documents] 
        OUTPUT DELETED.[Carer Doc Seq No] AS id 
        WHERE [Carer ID] = ${carerId}
        AND [Carer Doc Seq No] = ${id}`;

	console.log(query);
	const result = await database.simpleExecute(query);
	console.log(result);
	return result;
}
module.exports.remove = remove;
