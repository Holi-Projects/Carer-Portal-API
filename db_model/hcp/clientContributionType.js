const dataFields = {
	id          : '[ContributionTypeID]',
	countryCode : '[CountryCode]',
	name        : '[ContributionTypeName]',
};

const dateTimeFields = {};

const timeFields = {};

const dbModel = {
	tableName      : '[ClientContributionType]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
