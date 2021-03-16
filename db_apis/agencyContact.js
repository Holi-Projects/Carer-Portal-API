const database = require('../services/database.js');

const dbField = {
	id        : '[Contact ID]',
	agencyId  : '[Agency ID]',
	firstName : '[FirstName]',
	lastName  : '[SurName]',
	jobTitle  : '[Title]',
	phone     : '[Direct Phone]',
	mobile    : '[Mobile Phone]',
	email     : '[Email]',
	notes     : '[Notes]',
};

async function getList(user) {
	console.log('DB:agencyContact.getList(user)');

	const query = `SELECT 
			AC.[Contact ID] AS id,
			AC.[Agency ID] AS agencyId,
			--AC.[FirstName] AS firstName,
			--AC.[SurName] AS lastName,
			AC.[FirstName] + ' ' + AC.[SurName] AS name --,
			--AC.[Title] AS jobTitle,
			--AC.[Direct Phone] AS phone,
			--AC.[Mobile Phone] mobile,
			--AC.[Email] AS email,
			--AC.[Notes] AS notes
		FROM [Agencies Contacts] AC 
		JOIN [Agencies] A ON A.[ID] = AC.[Agency ID]
		WHERE A.[CompanyId] = ${user.companyId}
		ORDER BY AC.[FirstName], AC.[SurName]`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getList = getList;

async function getAgencyContacts(user, agencyId) {
	console.log('DB:getAgencyContacts(user, agencyId)');
	console.log(`agencyId: ${agencyId}`);

	let query = ``;
	if (agencyId !== undefined) {
		query = `SELECT 
				AC.[Contact ID] AS id,
				AC.[FirstName] AS firstName,
				AC.[SurName] AS lastName,
				AC.[FirstName] + ' ' + AC.[SurName] AS name,
				AC.[Title] AS jobTitle,
				AC.[Direct Phone] AS phone,
				AC.[Mobile Phone] mobile,
				AC.[Email] AS email,
				AC.[Notes] AS notes
			FROM [Agencies Contacts] AC 
			JOIN [Agencies] A ON A.[ID] = AC.[Agency ID]
			WHERE A.[ID] = ${agencyId} AND A.[CompanyId] = ${user.companyId}
			ORDER BY AC.[FirstName], AC.[SurName]`;
	}

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getAgencyContacts = getAgencyContacts;

async function getAgencyContact(user, agencyId, contactId) {
	console.log('DB:getAgencyContact(user, agencyId, contactId)');
	console.log(`agencyId: ${agencyId}`);
	console.log(`contactId: ${contactId}`);

	let query = ``;
	if (agencyId !== undefined && contactId !== undefined) {
		query = `SELECT 
				AC.[Contact ID] AS id,
				AC.[FirstName] AS firstName,
				AC.[SurName] AS lastName,
				AC.[FirstName] + ' ' + AC.[SurName] AS name,
				AC.[Title] AS jobTitle,
				AC.[Direct Phone] AS phone,
				AC.[Mobile Phone] mobile,
				AC.[Email] AS email,
				AC.[Notes] AS notes
			FROM [Agencies Contacts] AC 
			JOIN [Agencies] A ON A.[ID] = AC.[Agency ID]
			WHERE A.[ID] = ${agencyId}
			AND AC.[Contact ID] = ${contactId} 
			AND A.[CompanyId] = ${user.companyId}`;
	}

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getAgencyContact = getAgencyContact;

async function updateAgencyContact(user, contactId, agencyContact) {
	console.log('DB:updateAgencyContact(user, contactId, agencyContact)');

	let fields = [];
	for (let [ key, value ] of Object.entries(agencyContact)) {
		console.log(key, value);

		const dbFieldName = dbField[key];
		if (dbFieldName && dbFieldName !== '[Contact ID]') {
			if (typeof value === 'string') value = `'${value}'`; // strings need to single quoted in SQL

			fields.push(`${dbFieldName}=${value}`);
		}
	}
	const fieldList = fields.join();

	const stmt = `UPDATE [Agencies Contacts] SET ${fieldList} WHERE [Contact ID] = ${contactId}`;

	console.log(stmt);
	const result = await database.simpleExecute(stmt);
	//console.log(result);
	return result;
}
module.exports.updateAgencyContact = updateAgencyContact;

async function addAgencyContact(user, agencyContact) {
	console.log('DB:addAgencyContact(user, agencyContact)');

	// Duplicate Detection
	if (agencyContact.agencyId === undefined) {
		console.log('Agency ID is Mandatory');
		return { message: 'Agency ID is Mandatory' };
	}
	if (agencyContact.firstName === undefined) {
		console.log('First Name is Mandatory');
		return { message: 'First Name is Mandatory' };
	}
	if (agencyContact.firstName === undefined) {
		console.log('Last Name is Mandatory');
		return { message: 'Last Name is Mandatory' };
	}
	const query = `SELECT 
					[Contact ID] AS id 
				FROM [Agencies Contacts] 
                WHERE [FirstName] = '${agencyContact.firstName}'
                  AND [SurName] = '${agencyContact.lastName}'
				  AND [Agency ID] = ${agencyContact.agencyId}`;

	console.log(query);
	let result = await database.simpleExecute(query);

	if (result.recordset.length === 0) {
		let fields = [];
		let values = [];
		for (let [ key, value ] of Object.entries(agencyContact)) {
			console.log(key, value);

			const dbFieldName = dbField[key];
			if (value && dbFieldName && dbFieldName !== '[Contact ID]') {
				if (typeof value === 'string') value = `'${value}'`; // strings need to single quoted in SQL

				fields.push(dbFieldName);
				values.push(value);
			}
		}
		const fieldList = fields.join();
		const valueList = values.join();

		const stmt = `INSERT INTO [Agencies Contacts] (${fieldList}) OUTPUT INSERTED.[Contact ID] AS id VALUES (${valueList});`;

		console.log(stmt);
		result = await database.simpleExecute(stmt);
		console.log(result);
	} else {
		console.log('Duplicate detected');
	}
	return result;
}
module.exports.addAgencyContact = addAgencyContact;

async function deleteAgencyContact(user, agencyId, agencyContactId) {
	console.log('DB: function deleteAgencyContact(user, agencyContactId)');

	let query = `DELETE FROM [Agencies Contacts] 
        OUTPUT DELETED.[Contact ID] AS id 
        WHERE [Agency ID] = ${agencyId}
        AND [Contact ID] = ${agencyContactId}`;

	console.log(query);
	const result = await database.simpleExecute(query);
	console.log(result);
	return result;
}
module.exports.deleteAgencyContact = deleteAgencyContact;
