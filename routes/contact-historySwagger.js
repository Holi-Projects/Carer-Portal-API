var contactHistorySwagger = {
	'/api/contact-history' : {
		get : {
			tags        : [ 'Contact History' ],
			summary     : 'List Contact History',
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
					in          : 'query',
					name        : 'agencyId',
					description : 'Filter records to matching Agency',
					schema      : {
						type : 'string',
					},
					required    : false,
				},
				{
					in          : 'query',
					name        : 'carerId',
					description : 'Filter records to matching Carer',
					schema      : {
						type : 'string',
					},
					required    : false,
				},
				{
					in          : 'query',
					name        : 'clientId',
					description : 'Filter records to matching Client',
					schema      : {
						type : 'string',
					},
					required    : false,
				},
				{
					in          : 'query',
					name        : 'employeeId',
					description : 'Filter records to matching Employee',
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
										id                : {
											description : 'unique ID of Contact History Record',
											type        : 'integer',
											example     : 1,
										},
										clientId          : {
											description : 'Client ID',
											type        : 'integer',
											example     : 2,
										},
										clientName        : {
											description : "Client's firstName + '' + lastName",
											type        : 'string',
											example     : 'John Smith',
										},
										agencyId          : {
											description : 'Agency ID',
											type        : 'integer',
											example     : 3,
										},
										agencyName        : {
											description : "Agency's company name",
											type        : 'string',
											example     : 'Austin Health',
										},
										carerId           : {
											description : 'Carer ID',
											type        : 'integer',
											example     : 4,
										},
										carerName         : {
											description : "Carer's firstName + '' + lastName",
											type        : 'string',
											example     : 'Carrie Careful',
										},
										employeeId        : {
											description : 'Employee ID',
											type        : 'integer',
											example     : 5,
										},
										employeeName      : {
											description : "Employee's firstName + '' + lastName",
											type        : 'string',
											example     : 'Sally Scheduler',
										},
										clientPlanIssueId : {
											description : "ID of Client's Care Plan Issue",
											type        : 'integer',
											example     : 6,
										},
										date              : {
											description : 'Date of contact',
											type        : 'date',
											example     : '2020-10-04T00:00:00.000Z',
										},
										followUp          : {
											description : 'Follow Up',
											type        : 'string',
											example     : 'Call her next week',
										},
										followUpDate      : {
											description : 'Date to Follow Up by',
											type        : 'date',
											example     : '2020-10-11T00:00:00.000Z',
										},
										followUpComplete  : {
											description : 'Flag to show if Follow Up has been completed',
											type        : 'boolean',
											example     : false,
										},
										dateAdded         : {
											description : 'Date Added',
											type        : 'string',
											example     : '2020-10-04T00:00:00.000Z',
										},
										dateChanged       : {
											description : 'Date Changed',
											type        : 'string',
											example     : '2020-10-11T00:00:00.000Z',
										},
										printOnRoster     : {
											description : 'Flag to show if printed on Roster',
											type        : 'boolean',
											example     : false,
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
		/*post : {
			tags        : [ 'Client' ],
			summary     : 'Create Client',
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
			],
			requestBody : {
				required : true,
				content  : {
					'application/json' : {
						schema : {
							type       : 'object',
							properties : {
								firstName        : { description: '', type: 'string', example: '' },
								lastName         : { description: '', type: 'string', example: '' },
								address          : { description: '', type: 'string', example: '' },
								locality         : { description: '', type: 'string', example: '' },
								state            : { description: '', type: 'string', example: '' },
								postcode         : { description: '', type: 'string', example: '' },
								dateOfBirth      : { description: '', type: 'date', example: '' },
								gender           : { description: '', type: 'string', example: '' },
								serviceStartDate : { description: '', type: 'date', example: '' },
							},
						},
					},
				},
			},
			responses   : {
				201 : {
					description : 'Created',
					content     : {
						'application/json' : {
							schema : {
								$ref : '#/components/schemas/client',
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
		},*/
	},
	/*'/api/client/{clientId}' : {
		get : {
			tags        : [ 'Client' ],
			summary     : 'Client Details',
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
					name        : 'clientId',
					description : 'Client Id',
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
								$ref : '#/components/schemas/client',
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
		put : {
			tags        : [ 'Client' ],
			summary     : 'Update Client Details',
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
					name        : 'clientId',
					description : 'Client Id',
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
								firstName              : { description: '', type: 'string', example: '' },
								lastName               : { description: '', type: 'string', example: '' },
								address                : { description: '', type: 'string', example: '' },
								locality               : { description: '', type: 'string', example: '' },
								state                  : { description: '', type: 'string', example: '' },
								postcode               : { description: '', type: 'string', example: '' },
								country                : { description: '', type: 'string', example: '' },
								homePhone              : { description: '', type: 'string', example: '' },
								businessPhone          : { description: '', type: 'string', example: '' },
								mobile                 : { description: '', type: 'string', example: '' },
								fax                    : { description: '', type: 'string', example: '' },
								email                  : { description: '', type: 'string', example: '' },
								preferredContactMethod : { description: '', type: 'string', example: '' },
								dateOfBirth            : { description: '', type: 'date', example: '' },
								gender                 : { description: '', type: 'string', example: '' },
								primaryLanguageId      : { description: '', type: 'integer', example: '' },
								ethnicityId            : { description: '', type: 'integer', example: '' },
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
								invoiceAgencyId        : { description: '', type: 'integer', example: '' },
								invoiceReference       : { description: '', type: 'string', example: '' },
								clientManagerId        : { description: '', type: 'integer', example: '' },
								attachmentsPatn        : { description: '', type: 'string', example: '' },
								cardId                 : { description: '', type: 'string', example: '' },
								clientCategoryId       : { description: '', type: 'integer', example: '' },
								pricingGroupId         : { description: '', type: 'integer', example: '' },
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
								$ref : '#/components/schemas/client',
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
	},*/
};

module.exports = contactHistorySwagger;
