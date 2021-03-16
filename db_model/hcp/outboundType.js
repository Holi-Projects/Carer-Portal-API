const dataFields = {
	id        : '[OutboundID]',
	companyId : '[CompanyID]',
	code      : '[OutboundCode]',
	name      : '[OutboundName]',
};

const dateTimeFields = {};

const timeFields = {};

const dbModel = {
	tableName      : '[OutboundType]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
