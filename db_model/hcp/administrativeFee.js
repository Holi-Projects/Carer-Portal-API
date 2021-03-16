const dataFields = {
	id        : '[AdministrativeFeeID]',
	companyId : '[CompanyID]',
	name      : '[AdministrativeFeeName]',
	rate      : '[AdministrativeFeeRate]',
};

const dateTimeFields = {};

const timeFields = {};

const dbModel = {
	tableName      : '[AdministrativeFee]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
