const dataFields = {
	id                   : '[AgencyClientTaskNo]',
	fundingArrangementId : '[AgencyClientSeqNo]',
	taskId               : '[Task ID]',
	obsolete             : '[Obsolete]',
};

const dateTimeFields = {};

const timeFields = {};

const dbModel = {
	tableName      : '[Agencies Clients Tasks]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
