const dataFields = {
	id   : '[LeaveCalcModeID]',
	code : '[LeaveCalcModeCode]',
	name : '[LeaveCalcModeName]',
};

const dateTimeFields = {};

const timeFields = {};

const dbModel = {
	tableName      : '[LeaveCalcMode]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
