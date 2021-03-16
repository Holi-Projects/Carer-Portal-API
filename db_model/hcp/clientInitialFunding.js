const dataFields = {
	id                : '[ID]',
	clientId          : '[ClientID]',
	inboundId         : '[InboundID]',
	receivedAmount    : '[ReceivedAmount]',
	notReceivedAmount : '[NotReceivedAmount]',
	amount            : '[Amount]',
};

const dateTimeFields = {
	date      : '[Date]',
	timestamp : '[timestamp]',
};

const timeFields = {};

const dbModel = {
	tableName      : '[ClientInitialFunding]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
