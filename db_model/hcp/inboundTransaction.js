const dataFields = {
	id             : '[TransactionID]',
	inboundTypeId  : '[InboundID]',
	clientId       : '[ClientID]',
	month          : '[Month]',
	year           : '[Year]',
	expectedAmount : '[ExpectedAmount]',
	receivedAmount : '[ReceivedAmount]',
	balance        : '[Balance]',
};

const dateTimeFields = {
	timestamp    : '[timestamp]',
	receivedDate : '[ReceivedDate]',
};

const timeFields = {};

const dbModel = {
	tableName      : '[InboundTransaction]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
