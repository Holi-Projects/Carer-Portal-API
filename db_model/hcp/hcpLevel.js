const dataFields = {
	id          : '[HCPLevelCode]',
	countryCode : '[CountryCode]',
	name        : '[Name]',
	rate        : '[HCPLevelRate]',
	suffix      : '[HCPLevelSuffix]',
};

const dateTimeFields = {};

const timeFields = {};

const dbModel = {
	tableName      : '[HCPLevel]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
