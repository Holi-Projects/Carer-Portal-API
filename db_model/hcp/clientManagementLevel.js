const dataFields = {
	id                : '[ClientManagementLevelID]',
	clientId          : '[ClientID]',
	managementLevelId : '[ManagementLevelID]',
	//rate       : '[Rate]', defined in ManagementLevel
};

const dateTimeFields = {
	startDate : '[StartDate]',
	endDate   : '[EndDate]',
	timestamp : '[timestamp]',
};

const timeFields = {};

const dbModel = {
	tableName      : '[ClientManagementLevel]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
