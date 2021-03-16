const dataFields = {
	id        : '[ID]',
	companyId : '[CompanyId]',
	taskName  : '[Title]',
	taskCode  : '[Task Name]',
};

const dateTimeFields = {};

const timeFields = {};

const dbModel = {
	tableName      : '[Tasks]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
