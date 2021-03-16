const database = require('../services/database.js');
// const dateTimeUtil = require('../utils/dateTimeUtil');
const { mapDataForUpdate } = require('../utils/mapUtils');
const { mapDataForInsert } = require('../utils/mapUtils');
const { mapDataForSelect } = require('../utils/mapUtils');
// const dateFns = require('date-fns');
// const parseISO = require('date-fns/parseISO');

const dataFields = {
	id                     : '[Client Task Seq No]',
	clientId               : '[Client ID]',
	taskId                 : '[Task ID]',
	comments               : '[Comments]',
	duties                 : '[Duties]',
	genderPreferred        : '[GenderPreferred]',
	languageRefIDPreferred : '[LanguageRefIDPreferred]',
	mandatoryGender        : '[MandatoryGender]',
};

const dbFields = {
	dataFields     : dataFields,
	dateTimeFields : {},
	timeFields     : {},
};

async function getList(user, clientId) {
	console.log('DB:clientTask.getList(user, queryParams)');
	console.log(`clientId: ${clientId}`);
	let query = ``;

	let fieldList = mapDataForSelect('A', dbFields, dataFields.id, user.companyTimezone);

	query = `SELECT ${fieldList}
			, RTRIM(B.[Task Name]) as taskCode
			, B.Title as taskName
            FROM [dbo].[Clients Tasks] A
            LEFT JOIN [dbo].[Tasks] B
			ON A.[Task ID] = B.ID`;

	if (clientId !== null) {
		query += `
                WHERE A.[Client ID] = ${clientId}`;
	}

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getList = getList;

async function get(user, id) {
	console.log('DB:clientTask.get(user, id)');
	console.log(`id: ${id}`);

	let query = ``;
	if (id !== undefined) {
		let fieldList = mapDataForSelect('A', dbFields, dataFields.id, user.companyTimezone);

		query = `SELECT ${fieldList}
			, RTRIM(B.[Task Name]) as taskCode
			, B.Title as taskName
            FROM [dbo].[Clients Tasks] A
            LEFT JOIN [dbo].[Tasks] B
			ON A.[Task ID] = B.ID`;

		if (id !== undefined) {
			query += `
                WHERE A.[Client Task Seq No] = ${id}`;
		}
	}

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.get = get;

async function update(user, id, data) {
	console.log('DB:clientTask.update(user, id, data)');

	let keyValueList = mapDataForUpdate(data, dbFields, dataFields.id, user.companyTimezone);

	const query = `UPDATE [Clients Tasks] SET ${keyValueList} WHERE ${dataFields.id} = ${id}`;

	console.log(query);

	const result = await database.simpleExecute(query);
	//console.log(result);
	return result;
}
module.exports.update = update;

async function insert(user, data) {
	console.log('DB:clientTask.insert(user, data)');
	let [ fieldList, valueList ] = mapDataForInsert(data, dbFields, dataFields.id, user.companyTimezone);
	console.log(fieldList);
	console.log(valueList);
	// Insert data
	let query = `INSERT INTO [Clients Tasks] (${fieldList}) OUTPUT INSERTED.[Client Task Seq No] AS id VALUES (${valueList});\n`;

	console.log(query);
	result = await database.simpleExecute(query);
	console.log(result);
	return result;
}
module.exports.insert = insert;

async function remove(user, id) {
	console.log('DB:clientTask.remove(user, id)');

	let query = `DELETE FROM [Clients Tasks]
        OUTPUT DELETED.[Client Task Seq No] AS id 
		WHERE [Client Task Seq No] = ${id}\n`;

	console.log(query);
	const result = await database.simpleExecute(query);
	console.log(result);
	return result;
}
module.exports.remove = remove;
