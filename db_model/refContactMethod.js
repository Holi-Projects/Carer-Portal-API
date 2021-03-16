const dataFields = {
	id            : '[ContactMethodNo]',
	companyId     : '[CompanyId]',
	contactMethod : '[Contact Method]',
};

const dateTimeFields = {};

const timeFields = {};

const dbModel = {
	tableName      : '[Contact Methods]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
