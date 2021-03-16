const dataFields = {
	id                : '[ID]',
	companyId         : '[CompanyId]',
	clientId          : '[Client ID]',
	agencyId          : '[Agency ID]',
	carerId           : '[Carer ID]',
	employeeId        : '[Employee ID]',
	clientPlanIssueId : '[ClientPlanIssueID]',
	comments          : '[Comments]',
	followUp          : '[Follow Up]',
	followUpBy        : '[Follow Up By]',
	followUpComplete  : '[Follow Up Complete]',
	printOnRoster     : '[Print On Roster]',
};

const dateTimeFields = {
	date            : '[History Date]',
	followUpDate    : '[Follow Up Date]',
	addedDateTime   : '[Date Added]',
	changedDateTime : '[Date Changed]',
};

const timeFields = {};

const dbModel = {
	tableName      : '[Contact History]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
