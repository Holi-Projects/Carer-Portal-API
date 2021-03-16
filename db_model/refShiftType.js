const dataFields = {
	id           : '[ShiftTypeNo]',
	companyId    : '[CompanyId]',
	name         : '[ShiftTypeName]',
	stdStartTime : '[StdStartTime]',
	stdEndTime   : '[StdEndTime]',
	rate         : '[ShiftRate]',
	payRateId    : '[PayRateTypeNo]',
	displaySeqNo : '[DisplaySeqNo]',
	overnight    : '[Overnight]',
	_24Hr        : '[24Hr]',
};

const dateTimeFields = {};

const timeFields = {};

const dbModel = {
	tableName      : '[Ref Shift Types]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
