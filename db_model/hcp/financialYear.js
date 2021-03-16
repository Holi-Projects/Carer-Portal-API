const dataFields = {
	id : '[FinancialYearID]',
};

const dateTimeFields = {
	startDate : '[StartDate]',
	endDate   : '[EndDate]',
};

const timeFields = {};

const dbModel = {
	tableName      : '[FinancialYear]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
