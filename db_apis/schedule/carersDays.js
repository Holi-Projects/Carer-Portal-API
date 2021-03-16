const database = require('../../services/database.js');
// const dateTimeUtil = require('../utils/dateTimeUtil');
const { mapDataForUpdate } = require('../../utils/mapUtils');
const { mapDataForInsert } = require('../../utils/mapUtils');
const { mapDataForSelect } = require('../../utils/mapUtils');
// const dateFns = require('date-fns');
// const parseISO = require('date-fns/parseISO');

const dataFields = {
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

const dateTimeFields = {
	confirmClientRequested : '[ConfirmClientRequested]',
	confirmedClient        : '[ConfirmedClient]',
	confirmCarerRequested  : '[ConfirmCarerRequested]',
	confirmedCarer         : '[ConfirmedCarer]',
};

const dbFields = {
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : {},
};

async function getList(user, id) {
	console.log('DB:carersDays.getList(user, id)');
	console.log(`id: ${id}`);

	let query = ``;
	if (id !== undefined) {
		let fieldList = mapDataForSelect('A', dbFields, dataFields.id, user.companyTimezone);
		query = `SELECT ${fieldList},
			B.[First Name] + ' ' +  B.[Last Name] AS carerName
			FROM [Clients Schedule Carers] A
			LEFT JOIN [Carers] B ON A.[Carer ID] = B.[ID]
            WHERE A.[Client Schedule Seq No] = ${id}
              AND B.[CompanyId] = ${user.companyId}`;
	}

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getList = getList;

async function get(user, carerId, id) {
	console.log('DB:carersDays.get(user, carerId, id)');
	console.log(`carerId: ${carerId}`);
	console.log(`id: ${id}`);

	let query = ``;
	if (carerId !== undefined && id !== undefined) {
		let fieldList = mapDataForSelect('A', dbFields, dataFields.id, user.companyTimezone);
		query = `SELECT 
                ${fieldList},
				B.[First Name] + ' ' +  B.[Last Name] AS employeeName
			FROM [Clients Schedule Carers] A
			LEFT JOIN [Carers] B ON A.[Carer ID] = B.[ID]
            WHERE A.[ClientScheduleCarerNo] = ${id}
              AND C.[ID] = ${carerId} 
              AND C.[CompanyId] = ${user.companyId}`;
	}

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.get = get;

//Update carer availability information
async function update(user, carerId, id, data) {
	console.log('DB:carersDays.update(user, carerId, data)');

	let keyValueList = mapDataForUpdate(data, dbFields, dataFields.id, user.companyTimezone);

	const query = `UPDATE [Clients Schedule Carers] SET ${keyValueList} WHERE ${dataFields.id}=${id}`;

	console.log(query);

	const result = await database.simpleExecute(query);
	//console.log(result);
	return result;
}
module.exports.update = update;

async function insert(user, data) {
	console.log('DB:carersDays.insert(user, data)');
	let [ fieldList, valueList ] = mapDataForInsert(data, dbFields, dataFields.id, user.companyTimezone);
	//console.log(fields)
	const stmt = `INSERT INTO [Clients Schedule Carers] (${fieldList}) OUTPUT INSERTED.${dataFields.id} AS id VALUES (${valueList});`;

	console.log(stmt);
	result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}
module.exports.insert = insert;

async function remove(user, carerId, id) {
	console.log('DB:carerUnavailability.update(user, carerId, id)');

	let query = `DELETE FROM [Clients Schedule Carers]
         OUTPUT DELETED.${dataFields.id} AS id
         WHERE ${dataFields.id} = ${id}`;

	console.log(query);
	const result = await database.simpleExecute(query);
	console.log(result);
	return result;
}
module.exports.remove = remove;
