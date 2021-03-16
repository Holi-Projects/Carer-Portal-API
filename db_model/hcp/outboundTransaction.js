const dataFields = {
	id             : '[TransactionID]',
	outboundTypeId : '[OutboundID]',
	clientId       : '[ClientID]',
	month          : '[Month]',
	year           : '[Year]',
	amount         : '[Amount]',
};

const dateTimeFields = {};

const timeFields = {
	timestamp : '[timestamp]',
};

const dbModel = {
	tableName      : '[OutboundTransaction]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
