//import healthcheck from './healthCheckSwagger';
const healthcheck = require('./healthCheckSwagger');
const agency = require('./agencySwagger');
const auth = require('./authSwagger');
const booking = require('./bookingSwagger');
const carer = require('./carerSwagger');
const carerAvailability = require('./carerAvailabilitySwagger');
const carerDocument = require('./carerDocumentSwagger');
const carerLanguage = require('./carerLanguageSwagger');
const carerSkill = require('./carerSkillSwagger');
const carerUnavailability = require('./carerUnavailabilitySwagger');
const client = require('./clientSwagger');
const contactHistory = require('./contact-historySwagger');
const incident = require('./incidentSwagger');
const incidentDocument = require('./incidentDocumentSwagger');
const ref = require('./refSwagger');

//export default {
var swaggerDocument = {
	openapi    : '3.0.0',
	info       : {
		title          : 'Carer API',
		description    : 'API for Carer Manager Plus',
		termsOfService : '',
		contact        : {
			name  : 'Reinier Lolkema',
			email : 'reinier.lolkema@gmail.com',
			url   : 'https://github.com/reinier-lolkema/carer-api',
		},
		license        : {},
	},
	servers    : [
		{
			url         : 'http://localhost:8001',
			description : 'Local server',
		},
		{
			url         : 'http://dev.goalmaker.com.au:1102',
			description : 'Development server',
		},
	],
	security   : {
		ApiKeyAuth : [],
	},
	tags       : [
		{ name: 'General' },
		{ name: 'Agency' },
		{ name: 'Booking' },
		{ name: 'Carer' },
		{ name: 'Client' },
		{ name: 'Contact History' },
		{ name: 'Incident' },
		{ name: 'Reference data' },
	],
	paths      : {
		'/api/health-check' : healthcheck,
		...agency,
		...auth,
		...booking,
		...carer,
		...carerAvailability,
		...carerDocument,
		...carerLanguage,
		...carerSkill,
		...carerUnavailability,
		...client,
		...contactHistory,
		...incident,
		...incidentDocument,
		...ref,
	},
	components : {
		securitySchemes : {
			ApiKeyAuth : {
				type : 'apiKey',
				in   : 'header',
				name : 'x-access-token',
			},
		},
		schemas         : {
			error   : {
				type       : 'object',
				properties : {
					message : {
						type : 'string',
					},
				},
			},
			agency  : {
				name        : 'agency',
				description : '',
				type        : 'object',
				properties  : {
					id                 : {
						description : 'unique ID of Agency',
						type        : 'integer',
						required    : true,
						example     : '1',
					},
					name               : {
						description : "Agency's name",
						type        : 'string',
						example     : 'AAA Aged Carers',
					},
					contactFirstName   : {
						description : '',
						type        : 'string',
						example     : '',
					},
					contactLastName    : {
						description : '',
						type        : 'string',
						example     : '',
					},
					contactName        : {
						description : '',
						type        : 'string',
						example     : '',
					},
					contactJobTitle    : {
						description : '',
						type        : 'string',
						example     : '',
					},
					email              : {
						description : '',
						type        : 'string',
						example     : 'agency@example.com',
					},
					phone              : {
						description : '',
						type        : 'string',
						example     : '0355559999',
					},
					homePhone          : {
						description : '',
						type        : 'string',
						example     : '0312345678',
					},
					mobile             : {
						description : '',
						type        : 'string',
						example     : '0400123456',
					},
					fax                : {
						description : '',
						type        : 'string',
						example     : '',
					},
					pager              : {
						description : '',
						type        : 'string',
						example     : '',
					},
					pager2             : {
						description : '',
						type        : 'string',
						example     : '',
					},
					address            : {
						description : '',
						type        : 'string',
						example     : '1 Station Street',
					},
					locality           : {
						description : '',
						type        : 'string',
						example     : 'Melbourne',
					},
					state              : {
						description : '',
						type        : 'string',
						example     : 'VIC',
					},
					postcode           : {
						description : '',
						type        : 'string',
						example     : '3000',
					},
					country            : {
						description : '',
						type        : 'string',
						example     : 'AU',
					},
					webPage            : {
						description : '',
						type        : 'string',
						example     : '',
					},
					notes              : {
						description : '',
						type        : 'string',
						example     : 'Example note',
					},
					attachments        : {
						description : '',
						type        : 'string',
						example     : '',
					},
					attachmentsPath    : {
						description : '',
						type        : 'string',
						example     : 'C:\\...',
					},
					category           : {
						description : '',
						type        : 'string',
						example     : '',
					},
					lastInvoicedDate   : {
						description : '',
						type        : 'date',
						example     : '',
					},
					chargeGST          : {
						description : '',
						type        : 'boolean',
						example     : true,
					},
					orderReference     : {
						description : '',
						type        : 'string',
						example     : '',
					},
					cardId             : {
						description : '',
						type        : 'string',
						example     : '*None',
					},
					abbreviation       : {
						description : '',
						type        : 'string',
						example     : '',
					},
					invoiceByClient    : {
						description : '',
						type        : 'boolean',
						example     : true,
					},
					pricinGroupId      : {
						description : '',
						type        : 'integer',
						example     : 1,
					},
					pricingGroupName   : {
						description : '',
						type        : 'string',
						example     : '',
					},
					pricingGroupSuffix : {
						description : '',
						type        : 'string',
						example     : '',
					},
				},
			},
			carer   : {
				name        : 'carer',
				//in          : 'body',
				description : '',
				//required    : false,
				type        : 'object',
				properties  : {
					id                      : {
						description : 'unique ID of Carer',
						type        : 'integer',
						required    : true,
						example     : '1',
					},
					name                    : {
						description : "Carer's first and last name",
						type        : 'string',
						example     : 'John Smith',
					},
					firstName               : {
						description : "Carer's first name",
						type        : 'string',
						example     : 'John',
					},
					lastName                : {
						description : "Carer's last name",
						type        : 'string',
						example     : 'Smith',
					},
					address                 : {
						description : '',
						type        : 'string',
						example     : '1 Station Street',
					},
					locality                : {
						description : '',
						type        : 'string',
						example     : 'Melbourne',
					},
					state                   : {
						description : '',
						type        : 'string',
						example     : 'VIC',
					},
					postcode                : {
						description : '',
						type        : 'string',
						example     : '3000',
					},
					country                 : {
						description : '',
						type        : 'string',
						example     : 'AU',
					},
					homePhone               : {
						description : '',
						type        : 'string',
						example     : '0312345678',
					},
					mobile                  : {
						description : '',
						type        : 'string',
						example     : '0400123456',
					},
					businessPhone           : {
						description : '',
						type        : 'string',
						example     : '0355559999',
					},
					email                   : {
						description : '',
						type        : 'string',
						example     : 'carer@example.com',
					},
					preferredContactMethod  : {
						description : '',
						type        : 'string',
						example     : 'Phone',
					},
					dateOfBirth             : {
						description : '',
						type        : 'date',
						example     : '1994-10-11T00:00:00.000Z',
					},
					gender                  : {
						description : '',
						type        : 'string',
						example     : 'Female',
					},
					transportMode           : {
						description : '',
						type        : 'string',
						example     : 'Car',
					},
					cardId                  : {
						description : '',
						type        : 'string',
						example     : '*None',
					},
					notes                   : {
						description : '',
						type        : 'string',
						example     : 'Example note',
					},
					emergencyName           : {
						description : '',
						type        : 'string',
						example     : 'Emma Urgent',
					},
					emergencyPhone          : {
						description : '',
						type        : 'string',
						example     : '0300010002',
					},
					emergencyMobile         : {
						description : '',
						type        : 'string',
						example     : '0400100200',
					},
					emergencyEmail          : {
						description : '',
						type        : 'string',
						example     : 'comequick@example.com',
					},
					nurse                   : {
						description : '',
						type        : 'boolean',
						example     : true,
					},
					medicalNotes            : {
						description : '',
						type        : 'string',
						example     : 'Example medical notes',
					},
					attachmentsPath         : {
						description : '',
						type        : 'string',
						example     : 'C:...',
					},
					availableFromDate       : {
						description : '',
						type        : 'string',
						example     : '2017-10-24T00:00:00.000Z',
					},
					availableToDate         : {
						description : '',
						type        : 'string',
						example     : '2017-10-24T00:00:00.000Z',
					},
					availableComments       : {
						description : '',
						type        : 'string',
						example     : 'Example available comments',
					},
					availableFromDate       : {
						description : '',
						type        : 'string',
						example     : '2017-10-24T00:00:00.000Z',
					},
					availableToDate         : {
						description : '',
						type        : 'string',
						example     : '2017-10-24T00:00:00.000Z',
					},
					availableComments       : {
						description : '',
						type        : 'string',
						example     : 'Example available comments',
					},
					availableSchoolHolidays : {
						description : '',
						type        : 'boolean',
						example     : true,
					},
					available24HrShifts     : {
						description : '',
						type        : 'boolean',
						example     : false,
					},
					availableOvernighShifts : {
						description : '',
						type        : 'boolean',
						example     : true,
					},
					notAvailableFromDate    : {
						description : '',
						type        : 'string',
						example     : '2017-10-24T00:00:00.000Z',
					},
					notAvailableToDate      : {
						description : '',
						type        : 'string',
						example     : '2017-10-24T00:00:00.000Z',
					},
					notAvailableComments    : {
						description : '',
						type        : 'string',
						example     : 'Example not available comments',
					},
				},
			},
			client  : {
				name        : 'client',
				description : '',
				type        : 'object',
				properties  : {
					id                     : { description: '', type: 'integer', example: '' },
					firstName              : { description: '', type: 'string', example: '' },
					lastName               : { description: '', type: 'string', example: '' },
					name                   : { description: "firstName + ' ' + lastName", type: 'string', example: '' },
					address                : { description: '', type: 'string', example: '' },
					locality               : { description: '', type: 'string', example: '' },
					state                  : { description: '', type: 'string', example: '' },
					postcode               : { description: '', type: 'string', example: '' },
					country                : { description: '', type: 'string', example: '' },
					homePhone              : { description: '', type: 'string', example: '' },
					otherPhone             : { description: '', type: 'string', example: '' },
					mobile                 : { description: '', type: 'string', example: '' },
					email                  : { description: '', type: 'string', example: '' },
					preferredContactMethod : { description: '', type: 'string', example: '' },
					dateOfBirth            : { description: '', type: 'date', example: '' },
					gender                 : { description: '', type: 'string', example: '' },
					primaryLanguageId      : { description: '', type: 'integer', example: '' },
					primaryLanguage        : { description: '', type: 'string', example: '' },
					ethnicityId            : { description: '', type: 'integer', example: '' },
					ethnicity              : { description: '', type: 'string', example: '' },
					deceased               : { description: '', type: 'boolean', example: '' },
					medicalNotes           : { description: '', type: 'string', example: '' },
					treatmentNotes         : { description: '', type: 'string', example: '' },
					generalNotes           : { description: '', type: 'string', example: '' },
					serviceStartDate       : { description: '', type: 'date', example: '' },
					serviceFinishDate      : { description: '', type: 'date', example: '' },
					serviceComments        : { description: '', type: 'string', example: '' },
					notRequiredFromDate    : { description: '', type: 'date', example: '' },
					notRequiredToDate      : { description: '', type: 'date', example: '' },
					notRequiredComments    : { description: '', type: 'string', example: '' },
					doctorsName            : { description: '', type: 'string', example: '' },
					doctorsPhone           : { description: '', type: 'string', example: '' },
					doctorsMobile          : { description: '', type: 'string', example: '' },
					doctorsEmail           : { description: '', type: 'string', example: '' },
					doctorsAddress         : { description: '', type: 'string', example: '' },
					emergencyName          : { description: '', type: 'string', example: '' },
					emergencyPhone         : { description: '', type: 'string', example: '' },
					emergencyMobile        : { description: '', type: 'string', example: '' },
					emergencyEmail         : { description: '', type: 'string', example: '' },
					emergencyAddress       : { description: '', type: 'string', example: '' },
					emergency2Name         : { description: '', type: 'string', example: '' },
					emergency2Phone        : { description: '', type: 'string', example: '' },
					emergency2Mobile       : { description: '', type: 'string', example: '' },
					emergency2Email        : { description: '', type: 'string', example: '' },
					emergency2Address      : { description: '', type: 'string', example: '' },
					privateClient          : { description: '', type: 'boolean', example: '' },
					ndisClient             : { description: '', type: 'boolean', example: '' },
					jobReference           : { description: '', type: 'string', example: '' },
					invoiceClientId        : { description: '', type: 'integer', example: '' },
					invoiceClientFirstName : { description: '', type: 'string', example: '' },
					invoiceClientLastName  : { description: '', type: 'string', example: '' },
					invoiceClientName      : { description: '', type: 'string', example: '' },
					invoiceAgencyId        : { description: '', type: 'integer', example: '' },
					invoiceReference       : { description: '', type: 'string', example: '' },
					clientManagerId        : { description: '', type: 'integer', example: '' },
					clientManager          : { description: '', type: 'string', example: '' },
					attachmentsPatn        : { description: '', type: 'string', example: '' },
					cardId                 : { description: '', type: 'string', example: '' },
					clientCategoryId       : { description: '', type: 'integer', example: '' },
					clientCategory         : { description: '', type: 'string', example: '' },
					pricingGroupId         : { description: '', type: 'integer', example: '' },
					pricingGroupName       : { description: '', type: 'string', example: '' },
					pricingGroupSuffix     : { description: '', type: 'string', example: '' },
				},
			},

			booking : {
				name        : 'booking',
				description : '',
				type        : 'object',
				properties  : {
					id                          : { description: 'Bookings.ID', type: 'int', example: '' },
					clientId                    : { description: 'Bookings.[Client ID]', type: 'int', example: '' },
					taskId                      : { description: '[Bookings].[Task ID]', type: 'int', example: '' },
					carerId                     : {
						description : '[Bookings].[Carer ID]',
						type        : 'int',
						example     : '',
					},
					date                        : {
						description : '[Bookings].[Booking Date]',
						type        : 'date',
						example     : '',
					},
					startTime                   : {
						description : 'DATEADD(HOUR,-10,[Bookings].[Start Time])',
						type        : 'date',
						example     : '',
					},
					endTime                     : {
						description : 'DATEADD(HOUR,-10,[Bookings].[End Time])',
						type        : 'date',
						example     : '',
					},
					_24hrShift                  : {
						description : '[Bookings].[24hr Shift]',
						type        : 'string',
						example     : '',
					},
					pricingGroupId              : {
						description : '[Bookings].PricingGroupNo',
						type        : 'int',
						example     : '',
					},
					overnightShift              : {
						description : '[Bookings].[Overnight Shift]',
						type        : 'boolean',
						example     : '',
					},
					overnightShiftActive        : {
						description : '[Bookings].[Overnight Shift Active]',
						type        : 'boolean',
						example     : '',
					},
					dateAdvisedCare             : {
						description : '[Bookings].[Date Advised Carer]',
						type        : 'date',
						example     : '',
					},
					contactMethod               : {
						description : '[Bookings].[Contact Method] ',
						type        : 'string',
						example     : '',
					},
					adviseComments              : {
						description : '[Bookings].[Advise Comments]',
						type        : 'string',
						example     : '',
					},
					location                    : {
						description : '[Bookings].Location',
						type        : 'string',
						example     : '',
					},
					description                 : {
						description : '[Bookings].Description',
						type        : 'string',
						example     : '',
					},
					carerKMs                    : {
						description : '[Bookings].[Carer KMs]',
						type        : 'number',
						example     : '',
					},
					carerDisbursements          : {
						description : '[Bookings].[Carer Disbursements]',
						type        : 'string',
						example     : '',
					},
					chargedDisbursements        : {
						description : '[Bookings].[Charged Disbursements]',
						type        : 'string',
						example     : '',
					},
					additionalCharge            : {
						description : '[Bookings].[Additional Charge] ',
						type        : 'string',
						example     : '',
					},
					additionalChargeDescription : {
						description : '[Bookings].[Additional Charge Description]',
						type        : 'string',
						example     : '',
					},
					confirmedDateTime           : {
						description : '[Bookings].[Date Time Confirmed] ',
						type        : 'date',
						example     : '',
					},
					invoiceComments             : {
						description : '[Bookings].[Invoice Comments]',
						type        : 'string',
						example     : '',
					},
					carerPaymentComments        : {
						description : '[Bookings].[Carer Payment Comments]',
						type        : 'string',
						example     : '',
					},
					clientScheduleSeqNo         : {
						description : '[Bookings].[Client Schedule Seq No]',
						type        : 'string',
						example     : '',
					},
					cancelledDate               : {
						description : '[Bookings].[Date Cancelled]',
						type        : 'date',
						example     : '',
					},
					cancelCharges               : {
						description : '[Bookings].[Cancel Charges]',
						type        : 'boolean',
						example     : '',
					},
					clientName                  : {
						description : '[Clients][First Name] and [Clients][Last Name] joined with space ',
						type        : 'string',
						example     : '',
					},
					ndisClient                  : {
						description : '[Clients][NDIS Client]',
						type        : 'string',
						example     : '',
					},
					invoiceReference            : {
						description : '[Clients][Invoice Reference]',
						type        : 'string',
						example     : '',
					},
					taskName                    : { description: '[Tasks].Title ', type: 'string', example: '' },
					taskCode                    : {
						description : '[Tasks].[Task Name]',
						type        : 'string',
						example     : '',
					},
					activityId                  : {
						description : '[Tasks].[Activity ID] ',
						type        : 'string',
						example     : '',
					},
					clientEmail                 : {
						description : '[Clients][E-mail Address]',
						type        : 'string',
						example     : '',
					},
					clientHomePhone             : {
						description : '[Clients][Home Phone]',
						type        : 'string',
						example     : '',
					},
					clientMobile                : {
						description : '[Clients][Mobile Phone]',
						type        : 'string',
						example     : '',
					},
					clientAddress               : {
						description : '[Clients]Address + [Clients]City joined with space',
						type        : 'string',
						example     : '',
					},
					medicalNotes                : {
						description : '[Clients][Medical Notes]',
						type        : 'string',
						example     : '',
					},
					treatmentNotes              : {
						description : '[Clients][Treatment Notes]',
						type        : 'string',
						example     : '',
					},
					generalNotes                : {
						description : '[Clients][General Notes]',
						type        : 'string',
						example     : '',
					},
					clientPreferredContact      : {
						description : '[Clients][Preferred Contact Method]',
						type        : 'string',
						example     : '',
					},
					pricingGroupName            : {
						description : 'D.[PricingGroupName]',
						type        : 'string',
						example     : '',
					},
					carerName                   : {
						description : 'E.[First Name] and E.[Last Name] joined with space',
						type        : 'string',
						example     : '',
					},
					carerEmail                  : {
						description : 'E.[E-mail Address]',
						type        : 'string',
						example     : '',
					},
					carerBusinessPhone          : {
						description : 'E.[Business Phone]',
						type        : 'string',
						example     : '',
					},
					carerHomePhone              : { description: 'E.[Home Phone]', type: 'string', example: '' },
					carerMobile                 : { description: 'E.[Mobile Phone]', type: 'string', example: '' },
					carerLocality               : { description: 'E.City ', type: 'string', example: '' },
					availableFromDate           : {
						description : 'E.[Available From Date] ',
						type        : 'date',
						example     : '',
					},
					availableToDate             : {
						description : 'E.[Available To Date]',
						type        : 'date',
						example     : '',
					},
					availableComments           : {
						description : 'E.[Available Comments]',
						type        : 'string',
						example     : '',
					},
					notAvailableFromDate        : {
						description : 'E.[Not Available From Date]',
						type        : 'data',
						example     : '',
					},
					notAvailableToDate          : {
						description : 'E.[Not Available To Date] ',
						type        : 'date',
						example     : '',
					},
					notAvailableComment         : {
						description : 'E.[Not Available Comments]',
						type        : 'date',
						example     : '',
					},
					carerPreferredContactMethod : {
						description : 'E.[Preferred Contact Method]',
						type        : 'string',
						example     : '',
					},
					agencyName                  : { description: 'E.Company', type: 'string', example: '' },
					allowRepopulation           : {
						description : '[Bookings].[AllowRepopulation]',
						type        : 'boolean',
						example     : '',
					},
					chargeableHrs               : {
						description : '[Bookings].[Chargeable Hrs] ',
						type        : 'number',
						example     : '',
					},
					chargeableShifts            : {
						description : '[Bookings].[Chargeable Shifts] ',
						type        : 'int',
						example     : '',
					},
					chargeableKMs               : {
						description : '[Bookings].[Chargeable KMs]',
						type        : 'number',
						example     : '',
					},
				},
			},
		},
	},
};

module.exports = swaggerDocument;
