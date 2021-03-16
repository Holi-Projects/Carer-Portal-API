const database = require('../services/database.js');
// const dateTimeUtil = require('../utils/dateTimeUtil');
const {mapDataForUpdate} = require('../utils/mapUtils');
const {mapDataForInsert} = require('../utils/mapUtils');
const {mapDataForSelect} = require('../utils/mapUtils');
const dateFns = require('date-fns');
const parseISO = require('date-fns/parseISO');
const dateTimeUtil = require('../utils/dateTimeUtil');


const dataFields = {
	id:'[ClientNotRequiredNo]',
	clientId:'[ClientID]',
	notRequiredComments:'[Not Required Comments]',
};

const dateTimeFields = {
	startDate:'[Not Required From Date]',
	endDate:'[Not Required To Date]',
};

const timeFields = {};


const dbFields = {
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields
}

async function list(user, clientId, queryParams) {
	console.log('DB:clientNotRequired.list(user, id, queryParams)');
	console.log(`id: ${clientId}`);
	let query = '';
	var currentDate = new Date();
	let startDate = null;
	let endDate = null;
	let date = queryParams.date == undefined ? currentDate : parseISO(queryParams.date);
	let view = queryParams.view == undefined ? 'month' : queryParams.view;
	let dateFormat = 'yyyy-MM-dd';
	clientId =
		queryParams.clientId == undefined ? clientId : queryParams.clientId;

	
		if (view == 'month') {
			// The Calendar view displays a 6 week period which includes days before and after the month
			// calculate the startDate and endDate to cover the entire period
			const startOfMonth = dateFns.startOfMonth(date);
			const start = dateFns.startOfWeek(startOfMonth, { weekStartsOn: 1 });
			const end = dateFns.addDays(start, 41); // 6*7-1
			startDate = dateFns.format(start, dateFormat);
			endDate = dateFns.format(end, dateFormat);
		}
	
		if (view == 'week' || view == 'workWeek' || view == 'agenda') {
			startDate = dateFns.format(dateFns.startOfWeek(date, { weekStartsOn: 1 }), dateFormat);
			endDate = dateFns.format(dateFns.endOfWeek(date, { weekStartsOn: 1 }), dateFormat);
		}
	
		if (view == 'day') {
			startDate = dateFns.format(date, dateFormat);
			endDate = dateFns.format(date, dateFormat);
		}

	if (clientId !== undefined && clientId !== null) {
		let activeOnly = queryParams.activeOnly == undefined ? 'false' : queryParams.activeOnly;
        let fieldList = mapDataForSelect('A', dbFields, 'ClientNotRequiredNo', user.companyTimezone)
		query = `SELECT ${fieldList},
			B.[First Name] + ' ' +  B.[Last Name] AS clientName
			, 'Service not required' AS text
			, 'ServiceNotRequired' AS eventType
			, 2 AS eventTypeCode
			, null AS taskId
			FROM [Clients Not Required] A
			LEFT JOIN [Clients] B ON A.[ClientID] = B.[ID]
            WHERE A.[ClientID] = ${clientId}
			AND B.[CompanyId] = ${user.companyId}`;

		if (activeOnly === 'true') {
			query += `\nAND (A.[Not Required From Date] >= GETDATE() 
			OR  (A.[Not Required To Date] >= GETDATE() OR A.[Not Required To Date] IS NULL))`;
		}
		
		if (startDate !== null && endDate !== null && activeOnly === null) {
			query += `\nAND ${dateTimeUtil.areRangesOverlapping('A.[Not Required From Date]', 'A.[Not Required To Date]', `'${startDate}'`, `'${endDate}'`)}`
		}
		query += `\nORDER BY A.[Not Required From Date] ASC`;
	}

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.list = list;

async function get(user, clientId, id) {
	console.log('DB:clientNotRequired.get(user, clientId, id)');
	console.log(`carerId: ${clientId}`);
	console.log(`id: ${id}`);

	let query = ``;
	if (clientId !== undefined && id !== undefined) {
        let fieldList = mapDataForSelect('A', dbFields, 'ClientNotRequiredNo', user.companyTimezone)
		query = `SELECT 
                ${fieldList},
				B.[First Name] + ' ' +  B.[Last Name] AS employeeName
			FROM [Clients Not Required] A
			LEFT JOIN [Clients] B ON A.[ClientID] = B.[ID]
            WHERE A.[ClientNotRequiredNo] = ${id}
              AND A.[ClientID] = ${clientId} 
              AND A.[CompanyId] = ${user.companyId}`;
	}

	//console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.get = get;

//Update carer availability information
async function update(user, carerId, id, data) {
	console.log('DB:clientNotRequired.update(user, carerId, data)');

	let keyValueList = mapDataForUpdate(data, dbFields, 'ClientNotRequiredNo', user.companyTimezone)

	const query = `UPDATE [Clients Not Required]  SET ${keyValueList}
				WHERE [ClientNotRequiredNo]=${id} 
                --AND [Carer ID]=${carerId}`;

	console.log(query);

	const result = await database.simpleExecute(query);
	//console.log(result);
	return result;
}
module.exports.update = update;

async function insert(user, data) {
	console.log('DB:clientNotRequired.insert(user, data)');
	let [fieldList, valueList] = mapDataForInsert(data, dbFields, 'ClientNotRequiredNo', user.companyTimezone)
	//console.log(fields)
	const stmt = `INSERT INTO [Clients Not Required] (${fieldList}) OUTPUT INSERTED.[ClientNotRequiredNo] AS id VALUES (${valueList});`;

	console.log(stmt);
	result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}
module.exports.insert = insert;

async function remove(user, clientId, id) {
	console.log('DB:clientNotRequired.remove(user, carerId, id)');

	let query = `DELETE FROM [Clients Not Required] 
        OUTPUT DELETED.[ClientNotRequiredNo] AS id 
        WHERE [ClientID] = ${clientId}
        AND [ClientNotRequiredNo] = ${id}`;

	console.log(query);
	const result = await database.simpleExecute(query);
	console.log(result);
	return result;
}
module.exports.remove = remove;

async function isOverlapped(user, clientId, data) {
	console.log('DB:clientNotRequired.isOverlapped(user, data)');
	console.log(data);
	let fieldList = mapDataForSelect('A', dbFields, 'ClientNotRequiredNo', user.companyTimezone)

	let query = `
		DECLARE @startDate DATETIME = ${data.startDate}
		DECLARE @endDate DATETIME = ${data.endDate}

		SELECT ${fieldList} FROM [Clients Not Required] A WHERE [ClientID] = ${clientId}
		AND ${dateTimeUtil.areRangesOverlapping('A.[Not Required From Date]', 'A.[Not Required To Date]', `@startDate`, `@endDate`)}`
		
	console.log(query);
	const result = await database.simpleExecute(query);
	// console.log(result);
	return result.recordset;
}
module.exports.isOverlapped = isOverlapped;
