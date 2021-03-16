const dataFields = {
	id        : '[ManagementLevelID]',
	companyId : '[CompanyID]',
	code      : '[ManagementLevelTypeCode]',
	name      : '[Name]',
	rate      : '[Rate]',
};

const dateTimeFields = {};

const timeFields = {};

const dbModel = {
	tableName      : '[ManagementLevel]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
