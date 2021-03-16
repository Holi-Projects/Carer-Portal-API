const dataFields = {
	id        : '[ClientCategoryNo]',
	companyId : '[CompanyId]',
	name      : '[ClientCategoryName]',
	colour    : '[ClientColour]',
};

const dateTimeFields = {};

const timeFields = {};

const dbModel = {
	tableName      : '[Ref Client Categories]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
