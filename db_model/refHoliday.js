const dataFields = {
	id            : '[HolidayId]',
	companyId     : '[CompanyId]',
	name          : '[HolidayName]',
	startDate     : '[HolidayDateStart]',
	endDate       : '[HolidayDateEnd]',
	schoolHoliday : '[School Holiday]',
};

const dateTimeFields = {};

const timeFields = {};

const dbModel = {
	tableName      : '[Holidays]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
