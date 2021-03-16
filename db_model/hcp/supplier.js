const dataFields = {
	id        : '[SupplierID]',
	companyId : '[CompanyID]',
	name      : '[SupplierName]',
	address   : '[Address]',
	locality  : '[City]',
	state     : '[State]',
	postcode  : '[PostalCode]',
	phone     : '[Phone]',
	email     : '[Email]',
	ABN       : '[ABN]',
};

const dateTimeFields = {};

const timeFields = {};

const dbModel = {
	tableName      : '[Supplier]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
