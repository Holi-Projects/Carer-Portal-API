const dataFields = {
	id                 : '[ClientLeaveBookingID]',
	clientId           : '[ClientID]',
	leaveTaken         : '[LeaveTaken]',
	clientLeaveQuotaId : '[ClientLeaveQuotaID]',
	leaveTypeId        : '[LeaveTypeID]',
	leaveRemaining     : '[LeaveRemaining]',
};

const dateTimeFields = {
	startDate           : '[StartDate]',
	endDate             : '[EndDate]',
	timestamp           : '[timestamp]',
	exceedTempStartDate : '[ExceedTempStartDate]',
};

const timeFields = {};

const dbModel = {
	tableName      : '[ClientLeaveBooking]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
