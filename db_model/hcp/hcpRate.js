const dataFields = {
	id              : '[HCPRateID]',
	hcpLevelCode    : '[HCPLevelCode]',
	rate            : '[HCPRate]',
	financialYearId : '[FinancialYearID]',
};

const dateTimeFields = {
	startDate : '[HCPStartDate]',
	endDate   : '[HCPEndDate]',
};

const timeFields = {};

const dbModel = {
	tableName      : '[HCPRate]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
