const dataFields = {
	id         : '[IncidentDocNo]',
	incidentId : '[IncidentNo]',
	name       : '[IncidentDocName]',
	injury     : '[Injury]',
};

const dateTimeFields = {
	dateUploaded : '[DateUploaded]',
};

const timeFields = {};

const dbModel = {
	tableName      : '[Incidents Documents]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
