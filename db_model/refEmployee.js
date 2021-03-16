const dataFields = {
	id        : '[ID]',
	companyId : '[CompanyId]',
	firstName : '[First Name]',
	lastName  : '[Last Name]',
};

const dateTimeFields = {};

const timeFields = {};

const dbModel = {
	tableName      : '[Employees]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
