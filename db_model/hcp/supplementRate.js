const dataFields = {
	id              : '[SuppRateID]',
	hcpLevelCode    : '[HCPLevelCode]',
	supplementId    : '[SuppID]',
	rate            : '[Rate]',
	financialYearId : '[FinancialYearID]',
};

const dateTimeFields = {
	startDate : '[SuppStartDate]',
	endDate   : '[SuppEndDate]',
};

const timeFields = {};

const dbModel = {
	tableName      : '[SuppRate]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
