const tableAliases = {
	bookings : 'A',
	tasks    : 'B',
	clients  : 'C',
	carers   : 'E',
};

const primaryKeys = {
	bookings : {
		id        : '[ID]',
		forSelect : true,
	},
	clients  : {
		id        : '[ID]',
		forSelect : false,
	},
	carers   : {
		id        : '[ID]',
		forSelect : false,
	},
};

const dbFields = {
	bookings : {
		dataFields     : {
			id                          : '[ID]',
			companyId                   : '[CompanyID]',
			clientId                    : '[Client ID]',
			taskId                      : '[Task ID]',
			carerId                     : '[Carer ID]',
			shiftTypeId                 : '[ShiftTypeNo]',
			contactMethod               : '[Contact Method]',
			contactMethodClient         : '[Contact Method Client]',
			contactMethodAgency         : '[Contact Method Agency]',
			adviseComments              : '[Advise Comments]',
			chargeableHrs               : '[Chargeable Hrs]',
			chargeableShifts            : '[Chargeable Shifts]',
			chargeableKMs               : '[Chargeable KMs]',
			payableAmount               : '[Payable Amount]',
			paidAmount                  : '[Paid Amount]',
			bookingTotalCharge          : '[Booking Total Charge]',
			bookingTotalGST             : '[Booking Total GST]',
			location                    : '[Location]',
			description                 : '[Description]',
			carerComments               : '[Carer Comments]',
			carerKMs                    : '[Carer KMs]',
			carerDisbursements          : '[Carer Disbursements]',
			chargedDisbursements        : '[Charged Disbursements]',
			additionalCharge            : '[Additional Charge]',
			additionalChargeDescription : '[Additional Charge Description]',
			approvedBy                  : '[ApprovedBy]',
			transferredBy               : '[TransferredBy]',
			invoiceComments             : '[Invoice Comments]',
			carerPaymentComments        : '[Carer Payment Comments]',
			clientScheduleSeqId         : '[Client Schedule Seq No]',
			cancelCharges               : '[Cancel Charges]',
			lastModified                : '[LastModified]',
			addMethod                   : '[AddMethod]',
			modifiedBy                  : '[ModifiedBy]',
			allowRepopulation           : '[AllowRepopulation]',
			publicHoliday               : '[Public Holiday]',
		},
		dateTimeFields : {
			date                : '[Booking Date]',
			dateAdvisedCarer    : '[Date Advised Carer]',
			dateAdvisedClient   : '[Date Advised Client]',
			dateAdvisedAgency   : '[Date Advised Agency]',
			confirmedDateTime   : '[Date Time Confirmed]',
			rejectedDateTime    : '[Date Time Rejected]',
			approvedDateTime    : '[Date Time Approved]',
			transferredDateTime : '[Date Time Transferred]',
			cancelledDate       : '[Date Cancelled]',
			carerStartTime      : '[Carer Start Time]',
			carerEndTime        : '[Carer End Time]',
			dateAdded           : '[DateAdded]',
			startTime           : '[Start Time]',
			endTime             : '[End Time]',
		},
		timeFields     : {
			// startTime : '[Start Time]',
			// endTime   : '[End Time]',
		},
	},
	clients  : {
		dataFields : {
			id                           : '[ID]',
			clientEmail                  : '[E-mail Address]',
			clientHomePhone              : '[Home Phone]',
			clientMobile                 : '[Mobile Phone]',
			medicalNotes                 : '[Medical Notes]',
			treatmentNotes               : '[Treatment Notes]',
			generalNotes                 : '[General Notes]',
			clientPreferredContactMethod : '[Preferred Contact Method]',
		},
	},
	carers   : {
		dataFields     : {
			id                          : '[ID]',
			carerEmail                  : '[E-mail Address]',
			carerBusinessPhone          : '[Business Phone]',
			carerHomePhone              : '[Home Phone]',
			carerMobile                 : '[Mobile Phone]',
			carerCity                   : '[City]',
			availableFromDate           : '[Available From Date]',
			availableToDate             : '[Available To Date]',
			availableComments           : '[Available Comments]',
			notAvailableFromDate        : '[Not Available From Date]',
			notAvailableToDate          : '[Not Available To Date]',
			notAvailableComment         : '[Not Available Comments]',
			carerPreferredContactMethod : '[Preferred Contact Method]',
			agencyName                  : 'Company',
		},
		dateTimeFields : {
			availableFromDate    : '[Available From Date]',
			availableToDate      : '[Available To Date]',
			notAvailableFromDate : '[Not Available From Date]',
			notAvailableToDate   : '[Not Available To Date]',
		},
	},
};

const bookingDbModel = {
	dbFields     : dbFields,
	tableAliases : tableAliases,
	primaryKeys  : primaryKeys,
};

module.exports.bookingDbModel = bookingDbModel;
