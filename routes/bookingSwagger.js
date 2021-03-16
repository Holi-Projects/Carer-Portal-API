var bookingSwagger = {
	'/api/booking'                     : {
		get : {
			tags        : [ 'Booking' ],
			summary     : 'List Bookings',
			description : '',
			security    : [ 'ApiKeyAuth' ],
			parameters  : [
				{
					in          : 'header',
					name        : 'x-access-token', // Query Parameters
					description : 'Access Token',
					schema      : {
						type : 'string',
					},
					required    : true,
				},
				{
					in          : 'query',
					name        : 'clientId',
					description : 'Client Id',
					schema      : {
						type : 'string',
					},
					required    : false,
				},
				{
					in          : 'query',
					name        : 'carerId',
					description : 'Carer Id',
					schema      : {
						type : 'string',
					},
					required    : false,
				},
				{
					in          : 'query',
					name        : 'date',
					description : 'Selected Date (format: YYYY-MM-DD) (default value: today)',
					schema      : {
						type : 'string',
					},
					required    : false,
				},
				{
					in          : 'query',
					name        : 'view',
					description : 'View Type (e.g: month, week, agenda, all)(default value: month)',
					schema      : {
						type : 'string',
					},
					required    : false,
				},
				{
					in          : 'query',
					name        : 'status',
					description : 'Booking status',
					example     : 'unconfirmed',
					schema      : {
						type : 'string',
					},
					required    : false,
				},
			],
			responses   : {
				200 : {
					description : 'OK',
					content     : {
						'application/json' : {
							schema : {
								type  : 'array',
								items : {
									type       : 'object',
									properties : {
										id              : { description: '[Bookings].ID', type: 'int', example: '' },
										carerId         : { description: '[Carers].ID', type: 'int', example: '' },
										carerName       : {
											description :
												'[Carers].[First Name] and [Carers].[Last Name] joined with a space',
											type        : 'string',
											example     : '',
										},
										date            : {
											description : '[Bookings].[Booking Date]',
											type        : 'date',
											example     : '',
										},
										startTime       : {
											description : '[Bookings].[Start Time]',
											type        : 'date',
											example     : '',
										},
										endTime         : {
											description : '[Bookings].[End Time]',
											type        : 'date',
											example     : '',
										},
										taskCode        : {
											description : '[Tasks].[Task Name]',
											type        : 'string',
											example     : '',
										},
										taskName        : {
											description : '[Tasks] .[Title]',
											type        : 'string',
											example     : '',
										},
										taskId          : { description: '[Tasks] .[ID]', type: 'int', example: '' },
										description     : {
											description : '[Bookings].Description ',
											type        : 'string',
											example     : '',
										},
										clientId        : { description: '[Clients].[ID]', type: 'int', example: '' },
										clientName      : {
											description :
												'[Clients].[First Name] and [Clients].[Last Name] joined with a space',
											type        : 'string',
											example     : '',
										},
										text            : {
											description : '[Client/ Carer Name joined with [Activity ID]',
											type        : 'string',
											example     : '',
										},
										endDate         : {
											description : '[Bookings].[Booking Date] + [Bookings].[End Time]',
											type        : 'date',
											example     : '',
										},
										startDate       : {
											description : '[Bookings].[Booking Date] + [Bookings].[Start Time]',
											type        : 'date',
											example     : '',
										},
										shiftStatus     : {
											description : 'Booking status',
											type        : 'string',
											example     : 'Current Roster',
										},
										shiftStatusCode : {
											description : 'Booking status code',
											type        : 'int',
											example     : 5,
										},
									},
								},
							},
						},
					},
				},
				403 : {
					description : 'Error: Forbidden',
					content     : {
						'application/json' : {
							schema : {
								$ref : '#/components/schemas/error',
							},
						},
					},
				},
			},
		},
	},
	'/api/booking/{id}'                : {
		get : {
			tags        : [ 'Booking' ],
			summary     : 'Booking Details',
			description : '',
			security    : [ 'ApiKeyAuth' ],
			parameters  : [
				{
					in          : 'header',
					name        : 'x-access-token',
					description : 'Access Token',
					schema      : {
						type : 'string',
					},
					required    : true,
				},
				{
					in          : 'path',
					name        : 'id',
					description : 'Booking Id',
					schema      : {
						type : 'integer',
					},
					required    : true,
				},
			],
			responses   : {
				200 : {
					description : 'OK',
					content     : {
						'application/json' : {
							schema : {
								type  : 'array',
								items : {
									type       : 'object',
									properties : {
										id                          : {
											description : 'Bookings.ID',
											type        : 'int',
											example     : '',
										},
										clientId                    : {
											description : 'Bookings.[Client ID]',
											type        : 'int',
											example     : '',
										},
										taskId                      : {
											description : '[Bookings].[Task ID]',
											type        : 'int',
											example     : '',
										},
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
										'24hrShift'                 : {
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
											description :
												'[Clients][First Name] and [Clients][Last Name] joined with space ',
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
										taskName                    : {
											description : '[Tasks].Title ',
											type        : 'string',
											example     : '',
										},
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
										carerHomePhone              : {
											description : 'E.[Home Phone]',
											type        : 'string',
											example     : '',
										},
										carerMobile                 : {
											description : 'E.[Mobile Phone]',
											type        : 'string',
											example     : '',
										},
										carerLocality               : {
											description : 'E.City ',
											type        : 'string',
											example     : '',
										},
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
										agencyName                  : {
											description : 'E.Company',
											type        : 'string',
											example     : '',
										},
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
					},
				},
				403 : {
					description : 'Error: Forbidden',
				},
			},
		},
		put : {
			tags        : [ 'Booking' ],
			summary     : 'Update Booking Details',
			description : '',
			security    : [ 'ApiKeyAuth' ],
			parameters  : [
				{
					in          : 'header',
					name        : 'x-access-token',
					description : 'Access Token',
					schema      : {
						type : 'string',
					},
					required    : true,
				},
				{
					in          : 'path',
					name        : 'id',
					description : 'Booking Id',
					schema      : {
						type : 'integer',
					},
					required    : true,
				},
			],
			requestBody : {
				required : true,
				content  : {
					'application/json' : {
						schema : {
							type       : 'object',
							properties : {
								event              : {
									description : '"carerShiftStart" | "carerShiftEnd" | "confirmShift"',
									type        : 'string',
									example     : 'confirmShift',
								},
								eventDateTime      : {
									description : 'Specific value for shift start or end rather than the system time',
									type        : 'date',
									example     : '2020-07-06T11:33:55.000Z',
								},
								carerKMs           : {
									description : 'Kilometers claimed by the carer',
									type        : 'integer',
									example     : 10,
								},
								carerDisbursements : {
									description : 'Disbursements claimed by the carer',
									type        : 'float',
									example     : 24.95,
								},
								carerComments      : {
									description : "Carer's comments for the shift",
									type        : 'string',
									example     : 'Example Comment.',
								},
							},
						},
					},
				},
			},
			responses   : {
				200 : {
					description : 'OK',
					content     : {
						'application/json' : {
							schema : {
								$ref : '#/components/schemas/booking',
							},
						},
					},
				},
				403 : {
					description : 'Error: Forbidden',
					content     : {
						'application/json' : {
							schema : {
								$ref : '#/components/schemas/error',
							},
						},
					},
				},
			},
		},
	},
	'/api/booking/{bookingId}/payment' : {
		get : {
			tags        : [ 'Booking' ],
			summary     : 'Booking Payment List',
			description : '',
			security    : [ 'ApiKeyAuth' ],
			parameters  : [
				{
					in          : 'header',
					name        : 'x-access-token',
					description : 'Access Token',
					schema      : {
						type : 'string',
					},
					required    : true,
				},
				{
					in          : 'path',
					name        : 'id',
					description : 'Booking Id',
					schema      : {
						type : 'int',
					},
					required    : true,
				},
			],
			responses   : {
				200 : {
					description : 'OK',
					content     : {
						'application/json' : {
							schema : {
								type  : 'array',
								items : {
									//$ref : '#/components/schemas/carer',
									type       : 'object',
									properties : {
										rateType      : {
											description : '[Ref Period Types].[PeriodTypeName]',
											type        : 'number',
											example     : '',
										},
										qtyType       : {
											description : '[Ref Charge Rate Types].[Charge Rate Description] ',
											type        : 'string',
											example     : '',
										},
										chargedQty    : {
											description : '[Bookings Charges].[Qty Charged] ',
											type        : 'number',
											example     : '',
										},
										chargedShifts : {
											description : ' [Bookings Charges].[Shifts Charged] ',
											type        : 'number',
											example     : '',
										},
										chargedKMs    : {
											description : '[Bookings Charges].[KMs Charged] ',
											type        : 'number',
											example     : '',
										},
										payRateHour   : {
											description : '[Bookings Charges].[Pay Rate Hour] ',
											type        : 'number',
											example     : '',
										},
										payRateShift  : {
											description : '[Bookings Charges].[Pay Rate Shift] ',
											type        : 'number',
											example     : '',
										},
										payRateKm     : {
											description : '[Bookings Charges].[Pay Rate Km] ',
											type        : 'number',
											example     : '',
										},
										payableAmount : {
											description : '[Bookings Charges].[Payable Amount] ',
											type        : 'number',
											example     : '',
										},
										payType       : {
											description : '[Pay Rate Types].[Pay Type Description] ',
											type        : 'string',
											example     : '',
										},
									},
								},
							},
						},
					},
				},
				403 : {
					description : 'Error: Forbidden',
					content     : {
						'application/json' : {
							schema : {
								$ref : '#/components/schemas/error',
							},
						},
					},
				},
			},
		},
	},
	'/api/booking/{bookingId}/funding' : {
		get : {
			tags        : [ 'Booking' ],
			summary     : 'Booking Funding List',
			description : '',
			security    : [ 'ApiKeyAuth' ],
			parameters  : [
				{
					in          : 'header',
					name        : 'x-access-token',
					description : 'Access Token',
					schema      : {
						type : 'string',
					},
					required    : true,
				},
				{
					in          : 'path',
					name        : 'id',
					description : 'Booking Id',
					schema      : {
						type : 'int',
					},
					required    : true,
				},
			],
			responses   : {
				200 : {
					description : 'OK',
					content     : {
						'application/json' : {
							schema : {
								type  : 'array',
								items : {
									//$ref : '#/components/schemas/carer',
									type       : 'object',
									properties : {
										invoiceToAgencyName : {
											description : '[Agencies].Company ',
											type        : 'string',
											example     : '',
										},
										invoiceToClientName : {
											description :
												'[Clients].[Last Name] and [Clients].[First Name] joined with space',
											type        : 'string',
											example     : '',
										},
										chargedPercentage   : {
											description :
												'CONVERT(DECIMAL(10,2),[Bookings Funding].[Percentage Charged]*100)',
											type        : 'number',
											example     : '',
										},
										pricingGroupName    : {
											description : '[Ref Pricing Groups].PricingGroupName ',
											type        : 'string',
											example     : '',
										},
									},
								},
							},
						},
					},
				},
				403 : {
					description : 'Error: Forbidden',
					content     : {
						'application/json' : {
							schema : {
								$ref : '#/components/schemas/error',
							},
						},
					},
				},
			},
		},
	},
	'/api/booking/{bookingId}/charge'  : {
		get : {
			tags        : [ 'Booking' ],
			summary     : 'Booking Charge List',
			description : '',
			security    : [ 'ApiKeyAuth' ],
			parameters  : [
				{
					in          : 'header',
					name        : 'x-access-token',
					description : 'Access Token',
					schema      : {
						type : 'string',
					},
					required    : true,
				},
				{
					in          : 'path',
					name        : 'id',
					description : 'Booking Id',
					schema      : {
						type : 'int',
					},
					required    : true,
				},
			],
			responses   : {
				200 : {
					description : 'OK',
					content     : {
						'application/json' : {
							schema : {
								type  : 'array',
								items : {
									//$ref : '#/components/schemas/carer',
									type       : 'object',
									properties : {
										rateType                : {
											description : '[Ref Period Types].[PeriodTypeName]',
											type        : 'string',
											example     : '',
										},
										chargeRateQty           : {
											description : '[Bookings Charges Splits].[Charge Rate Qty]',
											type        : 'number',
											example     : '',
										},
										chargeRateShift         : {
											description : '[Bookings Charges Splits].[Charge Rate Shift]',
											type        : 'number',
											example     : '',
										},
										chargeRateKm            : {
											description : '[Bookings Charges Splits].[Charge Rate Km]',
											type        : 'number',
											example     : '',
										},
										invoiceNo               : {
											description : '[Bookings Charges Splits].[Invoice No]',
											type        : 'string',
											example     : '',
										},
										chargeGST               : {
											description : '[Bookings Charges Splits].[Charge GST]',
											type        : 'number',
											example     : '',
										},
										totalGST                : {
											description : '[Bookings Charges Splits].[Total GST]',
											type        : 'number',
											example     : '',
										},
										totalChargeExGST        : {
											description : '[Bookings Charges Splits].[Total Charge]',
											type        : 'number',
											example     : '',
										},
										totalCharge             : {
											description :
												'[Bookings Charges Splits].[Total Charge] plus  [Bookings Charges Splits].[Total GST]',
											type        : 'number',
											example     : '',
										},
										invoicedDate            : {
											description : '[Bookings Charges Splits].[Date Invoiced]',
											type        : 'date',
											example     : '',
										},
										invoiceToClientOrAgency : {
											description : 'Client Name or Company name',
											type        : 'string',
											example     : '',
										},
									},
								},
							},
						},
					},
				},
				403 : {
					description : 'Error: Forbidden',
					content     : {
						'application/json' : {
							schema : {
								$ref : '#/components/schemas/error',
							},
						},
					},
				},
			},
		},
	},
};

module.exports = bookingSwagger;
