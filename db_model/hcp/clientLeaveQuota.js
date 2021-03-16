const dataFields = {
	id                : '[ClientLeaveQuotaID]',
	leaveTypeId       : '[LeaveTypeID]',
	clientId          : '[ClientID]',
	financialYearId   : '[FinancialYearID]',
	leaveBookingQty   : '[LeaveBookingQty]',
	leaveTaken        : '[LeaveTaken]',
	currentLeaveQuota : '[CurrentLeaveQuota]',
};

const dateTimeFields = {
	//startDate           : '[StartDate]',
	//endDate             : '[EndDate]',
};

const timeFields = {};

const dbModel = {
	tableName      : '[ClientLeaveQuota]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
