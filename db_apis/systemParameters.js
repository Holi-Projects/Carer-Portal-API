const database = require('../services/database.js');
const { mapDataForSelect, mapDataForUpdate } = require('../utils/mapUtils');
const { dbModel } = require('../db_model/systemParameters.js');

/*async function getSystemParameters(user) {
	console.log('Run: function getSystemParameters(user) ');
	const companyId = user.companyId;
	//const companyId = 1; // debug

	let query = `SELECT
		[CompanyID] AS companyId,
		[Company] AS company,
		[ABN] AS ABN,
		[Last Name] AS lastName,
		[First Name] AS firstName,
		[E-mail Address] AS email,
		[Job Title] AS jobTitle,
		[Business Phone] AS businessPhone,
		[Home Phone] AS homePhone,
		[Mobile Phone] AS mobile,
		[Fax Number] AS fax,
		[Address] AS address,
		[City] AS locality,
		[State/Province] AS state,
		[ZIP/Postal Code] AS postcode,
		[CountryCode] AS countryCode,
		[Web Page] AS webPage,
		[Bank Name] AS bankName,
		[Bank BSB] AS bankBSB,
		[Bank Acct] AS bankAcct,
		[Company Logo] AS companyLogo,
		[Company Logo Width] AS companyLogoWidth,
		[Company Logo Height] AS companyLogoHeight,
		[Company Slogan] AS companySlogan,
		[Company Short Name] AS companyShortName,
		[Day Rate Start Time] AS dayRateStartTime,
		[Evening Rate Start Time] AS eveningRateStartTime,
		[StandardPayRateTypeNo] AS standardPayRateTypeNo,
		[AfterHrsPayRateTypeNo] AS afterHrsPayRateTypeNo,
		[SaturdayPayRateTypeNo] AS saturdayPayRateTypeNo,
		[SundayPayRateTypeNo] AS sundayPayRateTypeNo,
		[HolidayPayRateTypeNo] AS holidayPayRateTypeNo,
		[OvernightPayRateTypeNo] AS overnightPayRateTypeNo,
		[OvernightActivePayRateTypeNo] AS overnightActivePayRateTypeNo,
		[24HrsPayRateTypeNo] AS _24HrsPayRateTypeNo,
		[KmPayRateTypeNo] AS kmPayRateTypeNo,
		[KM Charge Rate] AS kmChargeRate,
		[KM Activity ID] AS kmActivityId,
		[KM Item Code] AS kmItemCode,
		[Travel Activity ID] AS travelActivityId,
		[ShowGettingStarted] AS showGettingStarted,
		[LastUpgradeNo] AS lastUpgradeNo,
		[VersionNo] AS versionNo,
		[Client Docs Path] AS clientDocsPath,
		[Carers Docs Path] AS carersDocsPath,
		[Employees Docs Path] AS employeesDocsPath,
		[Agencies Docs Path] AS agenciesDocsPath,
		[Client Photos Path] AS clientPhotosPath,
		[Carers Photos Path] AS carersPhotosPath,
		[Employees Photos Path] AS employeesPhotosPath,
		[MYOB Path] AS myobPath,
		[Photo Width] AS photoWidth,
		[Photo Height] AS photoHeight,
		[Forward Days] AS forwardDays,
		[Last Schedule Date] AS lastScheduleDate,
		[Last Travel Date] AS lastTravelDate,
		[Max Travel Minutes] AS maxTravelMinutes,
		[SMS Provider] AS smsProvider,
		[SMS Account] AS smsAccount,
		[SMS Password] AS smsPassword,
		RTRIM([SMS Send Msg In]) AS smsSendMsgIn,
		[SMS From Email] AS smsFromEmail,
		[SMS Send In Subject] AS smsSendInSubject,
		[Email Send As Subject] AS emailSendAsSubject,
		[GSTRate] AS gstRate,
		[GSTTaxCode] AS gstTaxCode,
		[NoGSTTaxCode] AS noGstTaxCode,
		[AcctSystemNo] AS acctSystemNo,
		[MYOB Interface] AS myobInterface,
		[MYOB Interface Type] AS myobInterfaceType,
		RTRIM([Sort Clients]) AS sortClients,
		RTRIM([Sort Carers]) AS sortCarers,
		[Carer Portal Introduction] AS carerPortalIntroduction,
		[Carer Manager Portal Introduction] AS carerManagerPortalIntroduction,
		[Carer Portal Used] AS carerPortalUsed,
		[Carer Portal Allow Edit] AS carerPortalAllowEdit,
		[Carer Portal Show Client Phone] AS carerPortalShowClientPhone,
		[Carer Portal URL] AS carerPortalURL,
		[Carer Manager Portal Used] AS carerManagerPortalUsed,
		[Show Task Abbreviation] AS showTaskAbbreviation,
		[PricingUsed] AS pricingUsed,
		[DefaultPricingGroupPrivate] AS defaultPricingGroupPrivate,
		[DefaultPricingGroupAgency] AS defaultPricingGroupAgency,
		[LogSMStoContactHistory] AS logSmsToContactHistory,
		[UseSMTP] AS useSMTP,
		[ServerSMTP] AS serverSMTP,
		[PortSMTP] AS portSMTP,
		[AuthenticationTypeSMTP] AS authenticationTypeSMTP,
		[DefaultUserNameSMTP] AS defaultUserNameSMTP,
		[DefaultPasswordSMTP] AS defaultPasswordSMTP,
		[UseSSLSMTP] AS useSslSMTP,
		[SMTPEmailBCC] AS emailBccSMTP,
		[Carer Roster Email Subject] AS carerRosterEmailSubject,
		[Carer Roster Email Body] AS carerRosterEmailBody,
		[Client Roster Email Subject] AS clientRosterEmailSubject,
		[Client Roster Email Body] AS clientRosterEmailBody,
		[Roster No Of Days] AS rosterNoOfDays,
		[Roster Start Weekday] AS rosterStartWeekday,
		[Invoice Terms Type] AS invoiceTermsType,
		[Invoice Terms Days] AS invoiceTermsDays,
		[Care Plan Emergency] AS carePlanEmergency,
		[Care Plan Change of Service] AS carePlanChangeofService,
		[Care Plan Change of Duties] AS carePlanChangeofDuties,
		[Care Plan Other Conditions] AS carePlanOtherConditions,
		[Append Task Prefix To Activity ID] AS appendTaskPrefixToActivityId,
		[Append Pricing Group Suffix To Activity ID] AS appendPricingGroupSuffixToActivityId,
		[Append Cancel Suffix To Activity ID] AS appendCancelSuffixToActivityId,
		[Roster Show Treatment Notes] AS rosterShowTreatmentNotes,
		[Separate Client Invoices By Agency] AS separateClientInvoicesByAgency,
		[Export Show Task Prefix] AS exportShowTaskPrefix,
		[Export Show Task Name] AS exportShowTaskName,
		[Export Show Job Ref] AS exportShowJobRef,
		[Export Show Card ID] AS exportShowCardId,
		[AcctIncomeCode] AS acctIncomeCode,
		[Company Timezone] AS companyTimezone,
		[DefaultShiftTypeNo] AS defaultShiftTypeId
	FROM [System Parameters] WHERE CompanyID = ${companyId}`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
} 

module.exports.getSystemParameters = getSystemParameters; */

async function get(user) {
	//console.log('DB:systemParameters.get(user)');

	let fieldList = mapDataForSelect('A', dbModel, dbModel.primaryKey, user.companyTimezone);

	const query = `SELECT ${fieldList} FROM ${dbModel.tableName} A
                    WHERE A.${dbModel.dataFields.companyId} = ${user.companyId}`;

	//console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.get = get;

async function update(user, data) {
	//console.log('DB:systemParameters.update(user, data)');
	//console.log(data);

	// escape any single quotes that may be in the carerPortalIntroduction or carerManagerPortalIntroduction with an extra single quote to stop the query from getting confused
	if (data.carerPortalIntroduction) {
		data.carerPortalIntroduction = data.carerPortalIntroduction.replace(/'/g, "''");
	}
	if (data.carerManagerPortalIntroduction) {
		data.carerManagerPortalIntroduction = data.carerManagerPortalIntroduction.replace(/'/g, "''");
	}

	let keyValueList = mapDataForUpdate(data, dbModel, dbModel.primaryKey, user.companyTimezone);

	const stmt = `UPDATE ${dbModel.tableName} SET ${keyValueList}
                    WHERE ${dbModel.dataFields.companyId} = ${user.companyId}`;

	//console.log(stmt);
	const result = await database.simpleExecute(stmt);
	//console.log(result);
	return result;
}
module.exports.update = update;

async function getGlobalParameters() {
	console.log('Run: function getGlobalParameters() ');

	let query = `SELECT
		[VersionNo] AS version,
		[ServerSMTP] AS serverSMTP,
		[PortSMTP] AS portSMTP,
		[AuthenticationTypeSMTP] AS authenticationTypeSMTP,
		[DefaultUserNameSMTP] AS defaultUserNameSMTP,
		[DefaultPasswordSMTP] AS defaultPasswordSMTP,
		[UseSSLSMTP] AS useSslSMTP,
		[SendFromEmail] AS sendFromEmail--,
		--[SMS Account] AS smsAccount,
		--[SMS Password] AS smsPassword
	FROM [Global Parameters]`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.getGlobalParameters = getGlobalParameters;
