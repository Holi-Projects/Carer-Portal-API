const dataFields = {
	id                 : '[ClientContributionID]',
	clientId           : '[ClientID]',
	contributionTypeId : '[ContributionTypeID]',
	amount             : '[Amount]',
};

const dateTimeFields = {
	startDate : '[StartDate]',
	endDate   : '[EndDate]',
	timestamp : '[timestamp]',
};

const timeFields = {};

const dbModel = {
	tableName      : '[ClientContribution]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
