const database = require('../services/database.js');
const refPostCode = require('./refPostCode.js');

//const { mapDataForSelect } = require('../utils/mapUtils');
const { mapDataForInsert } = require('../utils/mapUtils');
const { mapDataForUpdate } = require('../utils/mapUtils');

const dataFields = {
	id            : '[ClientContactNo]',
	clientId      : '[ClientID]',
	contactTypeId : '[TypeRefNo]',
	businessName  : '[BusinessName]',
	fullName      : '[fullName]',
	address       : '[Address]',
	locality      : '[City]',
	state         : '[State/Province]',
	postcode      : '[ZIP/Postal Code]',
	country       : '[Country/Region]',
	phone         : '[Phone]',
	mobile        : '[Mobile]',
	email         : '[Email]',
};

const dbFields = {
	dataFields     : dataFields,
	dateTimeFields : {},
	timeFields     : {},
};

async function getList(user, clientId) {
	console.log('DB:clientContact.getList(user, clientId)');
	console.log(`clientId: ${clientId}`);

	let query = ``;
	if (clientId !== undefined) {
		query = `SELECT 
                CC.[ClientContactNo] AS id,
                CC.[ClientID] AS clientId,
                CC.[TypeRefNo] AS contactTypeId,
                R.[RefName] AS contactType,
                CC.[BusinessName] AS businessName,
                CC.[FullName] AS fullName,
                CC.[Address] AS address,
                CC.[City] AS locality,
                CC.[State/Province] AS state,
                CC.[ZIP/Postal Code] AS postcode,
                CC.[City]+' '+CC.[State/Province]+' '+CC.[ZIP/Postal Code] AS locality2,
                P.ID AS localityId,
                CC.[Country/Region] AS country,
                CC.[Phone] AS phone,
                CC.[Mobile] AS mobile,
                CC.[Email] AS email
			FROM [Clients Contacts] CC 
            JOIN [Ref Types] R ON R.[RefNo] = CC.[TypeRefNo] AND R.[CompanyId] = ${user.companyId}
            LEFT JOIN [Post Codes AU] P ON P.[Locality] = CC.[City] AND P.[State] = CC.[State/Province] AND P.[PCode] = CC.[Zip/Postal Code]
			JOIN [Clients] C ON C.[ID] = CC.[ClientID]
			WHERE C.[ID] = ${clientId} AND C.[CompanyId] = ${user.companyId}
			ORDER BY R.[RefName], CC.[BusinessName], CC.[FullName]`;
	}

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getList = getList;

async function get(user, clientId, id) {
	console.log('DB:clientContact.get(user, clientId, id)');
	console.log(`clientId: ${clientId}`);
	console.log(`id: ${id}`);

	let query = ``;
	if (clientId !== undefined && id !== undefined) {
		query = `SELECT 
                CC.[ClientContactNo] AS id,
                CC.[ClientID] AS clientId,
                CC.[TypeRefNo] AS contactTypeId,
                R.[RefName] AS contactType,
                CC.[BusinessName] AS businessName,
                CC.[FullName] AS fullName,
                CC.[Address] AS address,
                CC.[City] AS locality,
                CC.[State/Province] AS state,
                CC.[ZIP/Postal Code] AS postcode,
                CC.[City]+' '+CC.[State/Province]+' '+CC.[ZIP/Postal Code] AS locality2,
                P.ID AS localityId,
                CC.[Country/Region] AS country,
                CC.[Phone] AS phone,
                CC.[Mobile] AS mobile,
                CC.[Email] AS email
			FROM [Clients Contacts] CC 
            JOIN [Ref Types] R ON R.[RefNo] = CC.[TypeRefNo] AND R.[CompanyId] = ${user.companyId}
            LEFT JOIN [Post Codes AU] P ON P.[Locality] = CC.[City] AND P.[State] = CC.[State/Province] AND P.[PCode] = CC.[Zip/Postal Code]
			JOIN [Clients] C ON C.[ID] = CC.[ClientID]
            WHERE CC.[ClientContactNo] = ${id} 
              AND C.[ID] = ${clientId} 
              AND C.[CompanyId] = ${user.companyId}`;
	}

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.get = get;

async function update(user, clientId, id, data) {
	console.log('DB:clientContact.update(user, clientId, id, data)');

	if (data.localityId) {
		const rows = await refPostCode.getRefPostCode(user, data.localityId);
		if (rows.length === 1) {
			data.locality = rows[0].localityLower;
			data.state = rows[0].state;
			data.postcode = rows[0].postcode;
		}
	}

	/*let fields = [];
	for (let [ key, value ] of Object.entries(data)) {
		console.log(key, value);

		const dbFieldName = dataFields[key];
		if (value && dbFieldName && dbFieldName !== '[ClientContactNo]') {
			if (typeof value === 'string') value = `'${value}'`; // strings need to single quoted in SQL

			fields.push(`${dbFieldName}=${value}`);
		}
	}
	const fieldList = fields.join();*/

	let keyValueList = mapDataForUpdate(data, dbFields, dataFields.id, user.companyTimezone);

	const query = `UPDATE [Clients Contacts] 
                        SET ${keyValueList}
                     WHERE ${dataFields.id} = ${id} 
                       AND [ClientID] = ${clientId}`;

	console.log(query);

	const result = await database.simpleExecute(query);
	//console.log(result);
	return result;
}
module.exports.update = update;

async function insert(user, data) {
	console.log('DB:clientContact.insert(user, data)');

	// TODO: Duplicate Detection -- rules need to be defined.

	if (data.localityId) {
		const rows = await refPostCode.getRefPostCode(user, data.localityId);
		if (rows.length === 1) {
			data.locality = rows[0].localityLower;
			data.state = rows[0].state;
			data.postcode = rows[0].postcode;
		}
	}

	/*let fields = [];
	let values = [];
	for (let [ key, value ] of Object.entries(data)) {
		console.log(key, value);

		const dbFieldName = dataFields[key];
		if (value && dbFieldName && dbFieldName !== '[ClientContactNo]') {
			if (typeof value === 'string') value = `'${value}'`; // strings need to single quoted in SQL

			fields.push(dbFieldName);
			values.push(value);
		}
	}
	const fieldList = fields.join();
	const valueList = values.join();*/

	let [ fieldList, valueList ] = mapDataForInsert(data, dbFields, dataFields.id, user.companyTimezone);
	console.log(fieldList);
	console.log(valueList);

	const stmt = `INSERT INTO [Clients Contacts] (${fieldList}) OUTPUT INSERTED.${dataFields.id} AS id VALUES (${valueList});`;

	console.log(stmt);
	result = await database.simpleExecute(stmt);
	console.log(result);
	/*} else {
		console.log('Duplicate detected');
	}*/
	return result;
}
module.exports.insert = insert;

async function remove(user, clientId, id) {
	console.log('DB:clientContact.remove(user, clientId, id)');

	let query = `DELETE FROM [Clients Contacts] 
        OUTPUT DELETED.[ClientContactNo] AS id 
        WHERE [ClientID] = ${clientId}
        AND [ClientContactNo] = ${id}`;

	console.log(query);
	const result = await database.simpleExecute(query);
	console.log(result);
	return result;
}
module.exports.remove = remove;
