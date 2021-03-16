const database = require('../services/database.js');
const dateTimeUtil = require('../utils/dateTimeUtil');
/*const mapUtils = require('../utils/mapUtils');

const dbField = {
	id                           : '[IncidentNo]',
	companyId                    : '[CompanyID]',
	carerId                      : '[Carer ID]',
	employeeId                   : '[Employee ID]',
	clientId                     : '[Client ID]',
	otherPartyName               : '[OtherPartyName]',
	incidentDateTime             : '[IncidentDateTime]',
	incidentLocation             : '[IncidentLocation]',
	incidentAddress              : '[IncidentAddress]',
	injuredNextOfKin             : '[InjuredNextOfKin]',
	witnesses                    : '[witnesses]',
	facts                        : '[Facts]',
	workDescription              : '[WorkDescription]',
	injury                       : '[Injury]',
	sharpsExposure               : '[SharpsExposure]',
	doctorNotified               : '[DoctorNotified]',
	doctorAttended               : '[DoctorAttended]',
	doctorName                   : '[DoctorName]',
	policeNotified               : '[PoliceNotified]',
	policeAttended               : '[PoliceAttended]',
	treatment                    : '[Treatment]',
	submittedDateTime            : '[DateIncidentSubmitted]',
	approvedDateTime             : '[DateIncidentApproved]',
	approvedByEmployeeId         : '[ApprovedByEmployeeID]',
	officeComments               : '[OfficeComments]',
	injuryClaimSubmittedDateTime : '[InjuryClaimSubmitted]',
	injuryClaimApprovedDateTime  : '[InjuryClaimApproved]',
	injuryClaimRefNo             : '[InjuryClaimRefNo]',
	injuryClaimComments          : '[InjuryClaimComments]',
};

const dateFields = [
	'[IncidentDateTime]',
	'[DateIncidentSubmitted]',
	'[DateIncidentApproved]',
	'[InjuryClaimSubmitted]',
	'[InjuryClaimApproved]',
];*/
const { mapDataForSelect, mapDataForInsert, mapDataForUpdate } = require('../utils/mapUtils');
const { dbModel } = require('../db_model/incident.js');

async function getList(user, queryParams) {
	console.log('DB:incident.getList(user, queryParams)');

	let query = `SELECT 
            I.[IncidentNo] AS id,
            I.[Carer ID] AS carerId,
            C1.[First Name] + ' ' + C1.[Last Name] AS carerName,
            I.[Employee ID] AS employeeId,
            E1.[First Name] + ' ' + E1.[Last Name] AS employeeName,
            I.[Client ID] AS clientId,
            C2.[First Name] + ' ' + C2.[Last Name] AS clientName,
            I.[OtherPartyName] AS otherPartyName,
            ${dateTimeUtil.dbDate2utcDate('I.[IncidentDateTime]', user.companyTimezone)} AS incidentDateTime,
            I.[IncidentLocation] AS incidentLocation,
            I.[IncidentAddress] AS incidentAddress,
            I.[InjuredNextOfKin] AS injuredNextOfKin,
            I.[witnesses] AS witnesses,
            I.[Facts] AS facts,
            I.[WorkDescription] AS workDescription,
            I.[Injury] AS injury,
            I.[SharpsExposure] AS sharpsExposure,
            I.[DoctorNotified] AS doctorNotified,
            I.[DoctorAttended] AS doctorAttended,
            I.[DoctorName] AS doctorName,
            I.[PoliceNotified] AS policeNotified,
            I.[PoliceAttended] AS policeAttended,
            I.[Treatment] AS treatment,
            ${dateTimeUtil.dbDate2utcDate('I.[DateIncidentSubmitted]', user.companyTimezone)} AS submittedDateTime,
            ${dateTimeUtil.dbDate2utcDate('I.[DateIncidentApproved]', user.companyTimezone)} AS approvedDateTime,
            I.[ApprovedByEmployeeID] AS approvedByEmployeeId,
            E2.[First Name] + ' ' + E2.[Last Name] AS approvedByEmployeeName,
            I.[OfficeComments] AS officeComments,
			${dateTimeUtil.dbDate2utcDate('I.[InjuryClaimSubmitted]', user.companyTimezone)}
				AS injuryClaimSubmittedDateTime,
			${dateTimeUtil.dbDate2utcDate('I.[InjuryClaimApproved]', user.companyTimezone)}
				AS injuryClaimApprovedDateTime,
            I.[InjuryClaimRefNo] AS injuryClaimRefNo,
            I.[InjuryClaimComments] AS injuryClaimComments
        FROM [Incidents] I 
        LEFT JOIN [Carers] C1 ON C1.[ID] = I.[Carer ID]
        LEFT JOIN [Clients] C2 ON C2.[ID] = I.[Client ID]
        LEFT JOIN [Employees] E1 ON E1.[ID] = I.[Employee ID]
        LEFT JOIN [Employees] E2 ON E2.[ID] = I.[ApprovedByEmployeeID]
        WHERE I.[CompanyID] = ${user.companyId} `;

	if (queryParams.carerId) query += `AND [Carer ID] = ${queryParams.carerId} `;
	if (queryParams.clientId) query += `AND [Client ID] = ${queryParams.clientId} `;
	if (queryParams.employeeId) query += `AND [Employee ID] = ${queryParams.employeeId} `;

	query += `ORDER BY I.[IncidentDateTime] DESC`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getList = getList;

async function get(user, id) {
	console.log('DB:incident.get(user, id)');
	console.log(`id: ${id}`);

	let query = ``;
	if (id !== undefined) {
		query = `SELECT 
            I.[IncidentNo] AS id,
            I.[Carer ID] AS carerId,
            I.[Employee ID] AS employeeId,
            I.[Client ID] AS clientId,
            I.[OtherPartyName] AS otherPartyName,
            ${dateTimeUtil.dbDate2utcDate('I.[IncidentDateTime]', user.companyTimezone)} AS incidentDateTime,
            I.[IncidentLocation] AS incidentLocation,
            I.[IncidentAddress] AS incidentAddress,
            I.[InjuredNextOfKin] AS injuredNextOfKin,
            I.[witnesses] AS witnesses,
            I.[Facts] AS facts,
            I.[WorkDescription] AS workDescription,
            I.[Injury] AS injury,
            I.[SharpsExposure] AS sharpsExposure,
            I.[DoctorNotified] AS doctorNotified,
            I.[DoctorAttended] AS doctorAttended,
            I.[DoctorName] AS doctorName,
            I.[PoliceNotified] AS policeNotified,
            I.[PoliceAttended] AS policeAttended,
            I.[Treatment] AS treatment,
            ${dateTimeUtil.dbDate2utcDate('I.[DateIncidentSubmitted]', user.companyTimezone)} AS submittedDateTime,
            ${dateTimeUtil.dbDate2utcDate('I.[DateIncidentApproved]', user.companyTimezone)} AS approvedDateTime,
            I.[ApprovedByEmployeeID] AS approvedByEmployeeId,
            I.[OfficeComments] AS officeComments,
			${dateTimeUtil.dbDate2utcDate('I.[InjuryClaimSubmitted]', user.companyTimezone)}
				AS injuryClaimSubmittedDateTime,
			${dateTimeUtil.dbDate2utcDate('I.[InjuryClaimApproved]', user.companyTimezone)} 
				AS injuryClaimApprovedDateTime,
            I.[InjuryClaimRefNo] AS injuryClaimRefNo,
            I.[InjuryClaimComments] AS injuryClaimComments
        FROM [Incidents] I 
        WHERE I.[IncidentNo] = ${id} 
		  AND I.[CompanyID] = ${user.companyId}`;

		if (user.userType === 'carer') query += ` AND [Carer ID] = ${user.userId}`;
	}

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.get = get;

async function update(user, id, data) {
	console.log('DB:incident.update(user, id, data, queryParams)');

	/*const fieldList = mapUtils.mapDataForUpdate2(data, dbField, user.companyTimezone, dateFields);

	let query = `UPDATE [Incidents] 
                    SET ${fieldList}
                    WHERE [IncidentNo] = ${id} 
					AND [CompanyID] = ${user.companyId}`;*/

	let keyValueList = mapDataForUpdate(data, dbModel, dbModel.primaryKey, user.companyTimezone);

	let stmt = `UPDATE ${dbModel.tableName} SET ${keyValueList}
				WHERE ${dbModel.primaryKey} = ${id} AND ${dbModel.dataFields.companyId} = ${user.companyId} `;

	if (user.userType === 'carer') stmt += ` AND [Carer ID] = ${user.userId}`;

	console.log(stmt);

	const result = await database.simpleExecute(stmt);
	//console.log(result);
	return result;
}
module.exports.update = update;

async function insert(user, data) {
	console.log('DB:incident.insert(user, data)');
	console.log(data);

	// TODO: Duplicate Detection -- rules need to be defined.

	/*const { fieldList, valueList } = mapUtils.mapDataForInsert2(data, dbField, user.companyTimezone, dateFields);
	const stmt = `INSERT INTO [Incidents] ([CompanyID],${fieldList}) OUTPUT INSERTED.[IncidentNo] AS id VALUES (${user.companyId},${valueList});`;*/

	const [ fieldList, valueList ] = mapDataForInsert(data, dbModel, dbModel.primaryKey, user.companyTimezone);
	const stmt = `INSERT INTO ${dbModel.tableName} ([CompanyID],${fieldList}) OUTPUT INSERTED.${dbModel.primaryKey} AS id VALUES (${user.companyId},${valueList});`;

	console.log(stmt);
	result = await database.simpleExecute(stmt);
	console.log(result);
	/*} else {
		console.log('Duplicate detected');
	}*/
	return result;
}
module.exports.insert = insert;

async function remove(user, id) {
	console.log('DB:incident.remove(user, id, queryParams)');

	let stmt = `DELETE FROM ${dbModel.tableName} OUTPUT DELETED.${dbModel.primaryKey} AS id 
				WHERE ${dbModel.primaryKey} = ${id} AND ${dbModel.dataFields.companyId} = ${user.companyId} `;

	if (user.userType === 'carer') stmt += ` AND [Carer ID] = ${user.userId}`;

	console.log(stmt);
	const result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}
module.exports.remove = remove;
