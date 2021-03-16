const dataFields = {
	id        : '[ID]',
	companyId : '[CompanyId]',
	name      : '[Company]',
};

const dateTimeFields = {};

const timeFields = {};

const dbModel = {
	tableName      : '[Agencies]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
