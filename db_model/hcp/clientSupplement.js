const dataFields = {
	id           : '[SuppClientID]',
	clientId     : '[ClientID]',
	supplementId : '[SuppID]',
	amount       : '[Amount]',
	note         : '[Note]',
};

const dateTimeFields = {
	startDate : '[StartDate]',
	endDate   : '[EndDate]',
	timestamp : '[timestamp]',
};

const timeFields = {};

const dbModel = {
	tableName      : '[ClientSupplement]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
