const dataFields = {
	id         : '[LeaveTypeID]',
	companyId  : '[CompanyID]',
	calcModeId : '[LeaveCalcModeID]',
	code       : '[LeaveTypeCode]',
	name       : '[LeaveTypeName]',
	quota      : '[LeaveQuota]',
};

const dateTimeFields = {};

const timeFields = {};

const dbModel = {
	tableName      : '[LeaveType]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
