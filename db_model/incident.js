const dataFields = {
	id                   : '[IncidentNo]',
	companyId            : '[CompanyID]',
	carerId              : '[Carer ID]',
	employeeId           : '[Employee ID]',
	clientId             : '[Client ID]',
	otherPartyName       : '[OtherPartyName]',
	incidentLocation     : '[IncidentLocation]',
	incidentAddress      : '[IncidentAddress]',
	injuredNextOfKin     : '[InjuredNextOfKin]',
	witnesses            : '[witnesses]',
	facts                : '[Facts]',
	workDescription      : '[WorkDescription]',
	injury               : '[Injury]',
	sharpsExposure       : '[SharpsExposure]',
	doctorNotified       : '[DoctorNotified]',
	doctorAttended       : '[DoctorAttended]',
	doctorName           : '[DoctorName]',
	policeNotified       : '[PoliceNotified]',
	policeAttended       : '[PoliceAttended]',
	treatment            : '[Treatment]',
	approvedByEmployeeId : '[ApprovedByEmployeeID]',
	officeComments       : '[OfficeComments]',
	injuryClaimRefNo     : '[InjuryClaimRefNo]',
	injuryClaimComments  : '[InjuryClaimComments]',
};

const dateTimeFields = {
	incidentDateTime             : '[IncidentDateTime]',
	submittedDateTime            : '[DateIncidentSubmitted]',
	approvedDateTime             : '[DateIncidentApproved]',
	injuryClaimSubmittedDateTime : '[InjuryClaimSubmitted]',
	injuryClaimApprovedDateTime  : '[InjuryClaimApproved]',
};

const timeFields = {};

const dbModel = {
	tableName      : '[Incidents]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
