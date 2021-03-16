const database = require('../services/database.js');
const refPostCode = require('./refPostCode.js');

const dbField = {
	id               : '[AgencyProgramNo]',
	agencyId         : '[Agency ID]',
	name             : '[ProgramName]',
	agencyContactId  : '[Agency Contact ID]',
	billingAttention : '[BillingAttention]',
	billingAddress   : '[BillingAddress]',
	billingLocality  : '[BillingCity]',
	billingState     : '[BillingState]',
	billingPostcode  : '[BillingPostalCode]',
	billingCountry   : '[BillingCountry]',
	billingEmail     : '[BillingEmail]',
};

async function getList(user) {
	console.log('DB:agencyProgram.getList(user)');

	let query = `SELECT
			[AgencyProgramNo] AS id,
			[Agency ID] AS agencyId,
			[ProgramName] AS name,
			[Agency Contact ID] AS agencyContactId,
			[BillingAttention] AS billingAttention,
			[BillingAddress] AS billingAddress,
			[BillingCity]+' '+[BillingState]+' '+[BillingPostalCode] AS billingLocality2,
			[BillingEmail] AS billingEmail
        FROM [Agencies Programs] `;

	//if (agencyId) query += `WHERE [Agency ID] = ${agencyId} `;

	query += `ORDER BY [ProgramName]`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getList = getList;

async function getAgencyPrograms(user, agencyId) {
	console.log('DB: function getAgencyPrograms(user, agencyId)');

	let query = `SELECT
			[AgencyProgramNo] AS id,
			[Agency ID] AS agencyId,
			[ProgramName] AS name,
			[Agency Contact ID] AS agencyContactId,
			[BillingAttention] AS billingAttention,
			[BillingAddress] AS billingAddress,
			[BillingCity]+' '+[BillingState]+' '+[BillingPostalCode] AS billingLocality2,
			P.[ID] AS billingLocalityId,
			[BillingEmail] AS billingEmail
		FROM [Agencies Programs]
		LEFT JOIN [Post Codes AU] P ON P.[Locality] = [BillingCity] AND P.[State] = [BillingState] AND P.[PCode] = [BillingPostalCode] `;

	if (agencyId) query += `WHERE [Agency ID] = ${agencyId} `;

	query += `ORDER BY [ProgramName]`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getAgencyPrograms = getAgencyPrograms;

async function getAgencyProgram(user, agencyProgramId) {
	console.log('DB: function getAgencyProgram(user, agencyProgramId)');

	let query = `SELECT
			[AgencyProgramNo] AS id,
			[Agency ID] AS agencyId,
			[ProgramName] AS name,
			[Agency Contact ID] AS agencyContactId,
			[BillingAttention] AS billingAttention,
			[BillingAddress] AS billingAddress,
			[BillingCity]+' '+[BillingState]+' '+[BillingPostalCode] AS billingLocality2,
			P.[ID] AS billingLocalityId,
			[BillingEmail] AS billingEmail
        FROM [Agencies Programs]
		LEFT JOIN [Post Codes AU] P ON P.[Locality] = [BillingCity] AND P.[State] = [BillingState] AND P.[PCode] = [BillingPostalCode]
        WHERE [AgencyProgramNo] = ${agencyProgramId}`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getAgencyProgram = getAgencyProgram;

async function updateAgencyProgram(user, agencyProgramId, agencyProgram) {
	console.log('DB: function updateAgencyProgram(user, agencyProgramId, agencyProgram)');

	if (agencyProgram.billingLocalityId) {
		const rows = await refPostCode.getRefPostCode(user, agencyProgram.billingLocalityId);
		if (rows.length === 1) {
			agencyProgram.billingLocality = rows[0].localityLower;
			agencyProgram.billingState = rows[0].state;
			agencyProgram.billingPostcode = rows[0].postcode;
		}
	}

	let fields = [];
	for (let [ key, value ] of Object.entries(agencyProgram)) {
		console.log(key, value);

		const dbFieldName = dbField[key];
		if (dbFieldName && dbFieldName !== '[AgencyProgramNo]') {
			if (typeof value === 'string') value = `'${value}'`; // strings need to single quoted in SQL

			fields.push(`${dbFieldName}=${value}`);
		}
	}
	const fieldList = fields.join();

	const stmt = `UPDATE [Agencies Programs] SET ${fieldList} WHERE [AgencyProgramNo] = ${agencyProgramId}`;

	console.log(stmt);
	const result = await database.simpleExecute(stmt);
	//console.log(result);
	return result;
}
module.exports.updateAgencyProgram = updateAgencyProgram;

async function addAgencyProgram(user, agencyProgram) {
	console.log('DB: function addAgencyProgram(user, agencyProgram)');

	// Duplicate Detection
	if (agencyProgram.agencyId === undefined) {
		console.log('Agency ID is Mandatory');
		return { message: 'Agency ID is Mandatory' };
	}
	if (agencyProgram.name === undefined) {
		console.log('Program Name is Mandatory');
		return { message: 'Program Name is Mandatory' };
	}
	const query = `SELECT 
					[AgencyProgramNo] AS id 
				FROM [Agencies Programs] 
				WHERE [ProgramName] = '${agencyProgram.name}'
				  AND [Agency ID] = ${agencyProgram.agencyId}`;

	console.log(query);
	let result = await database.simpleExecute(query);

	if (result.recordset.length === 0) {
		let fields = [];
		let values = [];

		if (agencyProgram.billingLocalityId) {
			const rows = await refPostCode.getRefPostCode(user, agencyProgram.billingLocalityId);
			if (rows.length === 1) {
				agencyProgram.billingLocality = rows[0].localityLower;
				agencyProgram.billingState = rows[0].state;
				agencyProgram.billingPostcode = rows[0].postcode;
			}
		}

		for (let [ key, value ] of Object.entries(agencyProgram)) {
			console.log(key, value);

			const dbFieldName = dbField[key];
			if (value && dbFieldName && dbFieldName !== '[AgencyProgramNo]') {
				if (typeof value === 'string') value = `'${value}'`; // strings need to single quoted in SQL

				fields.push(dbFieldName);
				values.push(value);
			}
		}
		const fieldList = fields.join();
		const valueList = values.join();

		const stmt = `INSERT INTO [Agencies Programs] (${fieldList}) OUTPUT INSERTED.[AgencyProgramNo] AS id VALUES (${valueList});`;

		console.log(stmt);
		result = await database.simpleExecute(stmt);
		console.log(result);
	} else {
		console.log('Duplicate detected');
		//let client = rows[0];
	}
	return result;
}
module.exports.addAgencyProgram = addAgencyProgram;

async function deleteAgencyProgram(user, agencyId, agencyProgramId) {
	console.log('DB: function deleteAgencyProgram(user, agencyProgramId)');

	let query = `DELETE FROM [Agencies Programs] 
        OUTPUT DELETED.[AgencyProgramNo] AS id 
        WHERE [Agency ID] = ${agencyId}
        AND [AgencyProgramNo] = ${agencyProgramId}`;

	console.log(query);
	const result = await database.simpleExecute(query);
	console.log(result);
	return result;
}
module.exports.deleteAgencyProgram = deleteAgencyProgram;
