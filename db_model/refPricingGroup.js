const dataFields = {
	id        : '[PricingGroupNo]',
	companyId : '[CompanyId]',
	name      : '[PricingGroupName]',
	suffix    : '[PricingGroupSuffix]',
};

const dateTimeFields = {};

const timeFields = {};

const dbModel = {
	tableName      : '[Ref Pricing Groups]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
