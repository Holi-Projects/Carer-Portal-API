const dataFields = {
	id            : '[SkillNo]',
	companyId     : '[CompanyId]',
	name          : '[Skill Name]',
	description   : '[Skill Description]',
	hasExpiryDate : '[Has Expiry Date]',
};

const dateTimeFields = {};

const timeFields = {};

const dbModel = {
	tableName      : '[Skills]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
