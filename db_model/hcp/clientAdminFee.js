const dataFields = {
	id         : '[ClientAdminFeeID]',
	clientId   : '[ClientID]',
	adminFeeId : '[AdministrativeFeeID]',
	//rate       : '[Rate]', defined in AdministrativeFee
};

const dateTimeFields = {
	startDate : '[StartDate]',
	endDate   : '[EndDate]',
	timestamp : '[timestamp]',
};

const timeFields = {};

const dbModel = {
	tableName      : '[ClientAdminFee]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
