const dataFields = {
	id               : '[AdjustmentBalanceID]',
	clientId         : '[ClientID]',
	amount           : '[Amount]',
	description      : '[Description]',
	adjustmentTypeId : '[AdjustmentTypeID]',
};

const dateTimeFields = {
	date      : '[Date]',
	timestamp : '[timestamp]',
};

const timeFields = {};

const dbModel = {
	tableName      : '[ClientAdjustmentBalance]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
