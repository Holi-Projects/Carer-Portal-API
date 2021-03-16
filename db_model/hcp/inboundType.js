const dataFields = {
	id        : '[InboundID]',
	companyId : '[CompanyID]',
	code      : '[InboundCode]',
	name      : '[InboundName]',
};

const dateTimeFields = {};

const timeFields = {};

const dbModel = {
	tableName      : '[InboundType]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
