const dataFields = {
	id                : '[ClientInitialBalanceID]',
	amount            : '[Amount]',
	clientId          : '[ClientID]',
	clientPortion     : '[ClientPortion]',
	governmentPortion : '[GovPortion]',
	note              : '[Note]',
};

const dateTimeFields = {
	date : '[Date]',
};

const timeFields = {};

const dbModel = {
	tableName      : '[ClientInitialBalance]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
