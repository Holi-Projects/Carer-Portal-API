const dataFields = {
	id                   : '[ClientHCP]',
	clientId             : '[ClientID]',
	hcpLevelCode         : '[HCPLevelCode]',
	amount               : '[Amount]',
	note                 : '[Note]',
	serviceDescription   : '[ServiceDescription]',
	fundingArrangementId : '[AgenciesClientsSeqNo]',
};

const dateTimeFields = {
	startDate : '[StartDate]',
	endDate   : '[EndDate]',
	timestamp : '[timestamp]',
};

const timeFields = {};

const dbModel = {
	tableName      : '[ClientHCP]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
