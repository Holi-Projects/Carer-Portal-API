const dataFields = {
	id                     : '[GlobalNo]',
	version                : '[VersionNo]',
	serverSMTP             : '[ServerSMTP]',
	portSMTP               : '[PortSMTP]',
	authenticationTypeSMTP : '[AuthenticationTypeSMTP]',
	defaultUserNameSMTP    : '[DefaultUserNameSMTP]',
	defaultPasswordSMTP    : '[DefaultPasswordSMTP]',
	useSslSMTP             : '[UseSSLSMTP]',
	sendFromEmail          : '[SendFromEmail]',
	//smsAccount             : '[SMS Account]',
	//smsPassword            : '[SMS Password]',
};

const dateTimeFields = {};

const timeFields = {};

const dbModel = {
	tableName      : '[Global Parameters]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
