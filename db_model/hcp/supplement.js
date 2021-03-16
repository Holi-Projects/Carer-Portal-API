const dataFields = {
	id        : '[SuppID]',
	companyId : '[CompanyID]',
	code      : '[SuppCode]',
	name      : '[Name]',
};

const dateTimeFields = {};

const timeFields = {};

const dbModel = {
	tableName      : '[Supplement]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
