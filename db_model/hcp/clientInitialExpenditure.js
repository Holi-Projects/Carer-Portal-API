const dataFields = {
	id         : '[ID]',
	clientId   : '[ClientID]',
	outboundId : '[OutboundID]',
	amount     : '[Amount]',
};

const dateTimeFields = {
	date      : '[Date]',
	timestamp : '[timestamp]',
};

const timeFields = {};

const dbModel = {
	tableName      : '[ClientInitialExpenditure]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
