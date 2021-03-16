const dataFields = {
	id                       : '[ID]',
	companyId                : '[CompanyID]',
	firstName                : '[First Name]',
	lastName                 : '[Last Name]',
	address                  : '[Address]',
	locality                 : '[City]',
	state                    : '[State/Province]',
	postcode                 : '[ZIP/Postal Code]',
	country                  : '[Country/Region]',
	businessPhone            : '[Business Phone]',
	homePhone                : '[Home Phone]',
	mobile                   : '[Mobile Phone]',
	faxNumber                : '[Fax Number]',
	email                    : '[E-mail Address]',
	jobTitle                 : '[Job Title]',
	gender                   : '[Gender]',
	deceased                 : '[Deceased]',
	transportMode            : '[Transport Mode]',
	notes                    : '[Notes]',
	medicalNotes             : '[Medical Notes]',
	skills                   : '[Skills List]',
	company                  : '[Company]',
	ABN                      : '[ABN]',
	taxFileNo                : '[Tax File No]',
	webPage                  : '[Web Page]',
	emergencyName            : '[Emergency Name]',
	emergencyPhone           : '[Emergency Phone]',
	emergencyMobile          : '[Emergency Mobile]',
	emergencyEmail           : '[Emergency Email]',
	availableComments        : '[Available Comments]',
	availableSchoolHolidays  : '[Available School Holidays]',
	available24hrShifts      : '[Available 24hr Shifts]',
	availableOvernightShifts : '[Available Overnight Shifts]',
	notAvailableComments     : '[Not Available Comments]',
	preferredContactMethod   : '[Preferred Contact Method]',
	photoFileName            : '[Photo File Name]',
	attachmentsPath          : '[AttachmentsPath]',
	cardId                   : '[Card ID]',
	nurse                    : '[Nurse]',
};

const dateTimeFields = {
	dateOfBirth          : '[Date of Birth]',
	availableFromDate    : '[Available From Date]',
	availableToDate      : '[Available To Date]',
	notAvailableFromDate : '[Not Available From Date]',
	notAvailableToDate   : '[Not Available To Date]',
};

const timeFields = {};

const dbModel = {
	tableName      : '[Carers]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
