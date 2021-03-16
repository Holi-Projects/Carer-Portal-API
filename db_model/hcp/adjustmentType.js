const dataFields = {
	id        : '[AdjustmentTypeID]',
	companyId : '[CompanyID]',
	name      : '[AdjustmentName]',
	code      : '[AdjustmentCode]',
};

const dateTimeFields = {};

const timeFields = {};

const dbModel = {
	tableName      : '[AdjustmentType]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
