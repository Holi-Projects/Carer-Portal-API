const database = require('../../services/database.js');

const { mapDataForUpdate } = require('../../utils/mapUtils');
const { mapDataForInsert } = require('../../utils/mapUtils');
const { mapDataForSelect } = require('../../utils/mapUtils');

const dataFields = {
	id                : '[ClientScheduleFundNo]',
	clientScheduleId  : '[Client Schedule Seq No]',
	agencyClientId    : '[AgencyClientSeqNo]',
	//pricingGroupId	  : '[PricingGroupNo]',
	//invoiceToClientId : '[Invoice To Client ID]',
	//invoiceToAgencyId : '[Invoice To Agency ID]',
	percentageCharged : '[Percentage Charged]',
};

const dateTimeFields = {
	startDate : '[ChargeStartDate]',
	endDate   : '[ChargeFinishDate]',
};

const dbFields = {
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : {},
};

async function getList(user, clientScheduleId) {
	console.log('DB:clientScheduleFunding.getList(user, clientScheduleId)');
	console.log(`clientScheduleId: ${clientScheduleId}`);

	let query = ``;
	if (clientScheduleId !== undefined) {
		let fieldList = mapDataForSelect('CSF', dbFields, dataFields.id, user.companyTimezone);
		query = `SELECT ${fieldList}
		, CASE
		WHEN (AC.[Agency ID] IS NOT NULL) THEN AC.[Agency ID]
		WHEN (AC.[Agency ID] IS NULL AND AC.[Client ID Payer] IS NOT NULL) THEN AC.[Client ID Payer]
		ELSE AC.[Client ID]
		END AS fundingId
		, CASE
				WHEN (AC.[Agency ID] IS NOT NULL) THEN D.[PricingGroupName]
				WHEN (AC.[Agency ID] IS NULL AND AC.[Client ID Payer] IS NOT NULL) THEN E.[PricingGroupName]
				ELSE D.[PricingGroupName]
		END AS pricingGroupName
		FROM [Clients Schedule] CS
		JOIN [Clients Schedule Funding] CSF ON CSF.[Client Schedule Seq No] = CS.[Client Schedule Seq No]
		LEFT JOIN [Agencies Clients] AC ON AC.[SeqNo] = CSF.[AgencyClientSeqNo]
		LEFT JOIN [Clients] IC ON IC.[ID] = AC.[Client ID]
		LEFT JOIN [Agencies] IA ON IA.[ID] = AC.[Agency ID]
		LEFT JOIN [Ref Pricing Groups] D ON IA.[PricingGroupNo] = D.PricingGroupNo
		LEFT JOIN [Ref Pricing Groups] E ON IC.[PricingGroupNo] = E.PricingGroupNo
            WHERE CS.[Client Schedule Seq No] = ${clientScheduleId}
            AND IC.[CompanyId] = ${user.companyId}`;
	}

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getList = getList;

async function get(user, id) {
	console.log('DB:clientScheduleFunding.get(user, id)');
	console.log(`id: ${id}`);

	let query = ``;
	if (carerId !== undefined && id !== undefined) {
		let fieldList = mapDataForSelect('CSF', dbFields, dataFields.id, user.companyTimezone);
		query = `SELECT 
                ${fieldList}
			FROM [Clients Schedule Funding] CSF
            WHERE A.[ClientScheduleFundNo] = ${id}`;
	}

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.get = get;

async function update(user, id, data) {
	console.log('DB:clientScheduleFunding.update(user, id, data)');

	let keyValueList = mapDataForUpdate(data, dbFields, dataFields.id, user.companyTimezone);

	const stmt = `UPDATE [Clients Schedule Funding]
                    SET ${keyValueList}
				WHERE [ClientScheduleFundNo]=${id}`;

	console.log(stmt);
	const result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}
module.exports.update = update;

async function insert(user, data) {
	console.log('DB:clientScheduleFunding.insert(user, data)');
	let [ fieldList, valueList ] = mapDataForInsert(data, dbFields, dataFields.id, user.companyTimezone);
	//console.log(fields)
	const stmt = `INSERT INTO [Clients Schedule Funding] (${fieldList}) OUTPUT INSERTED.${dataFields.id} AS id VALUES (${valueList});`;

	console.log(stmt);
	result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}
module.exports.insert = insert;

async function remove(user, id) {
	console.log('DB:clientScheduleFunding.remove(user, id)');

	const stmt = `DELETE FROM [Clients Schedule Funding] 
             OUTPUT DELETED.${dataFields.id} AS id 
             WHERE ${dataFields.id} = ${id}`;

	console.log(stmt);
	const result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}
module.exports.remove = remove;
