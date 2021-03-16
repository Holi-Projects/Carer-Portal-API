const dataFields = {
	id          : '[PayRateTypeNo]',
	companyId   : '[CompanyId]',
	code        : '[Pay Type Code]',
	description : '[Pay Type Description]',
	unit        : '[Pay Type Unit]',
	multiplier  : '[Multiplier]',
	hourly      : '[Hourly]',
};

const dateTimeFields = {};

const timeFields = {};

const dbModel = {
	tableName      : '[Pay Rate Types]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
