var clientSwagger = {
	'/api/client'            : {
		get  : {
			tags        : [ 'Client' ],
			summary     : 'List Clients',
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
					name        : 'activeOnly',
					description : 'Return only active clients',
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
											description : 'unique ID of client',
											type        : 'integer',
											example     : '1',
										},
										firstName         : {
											description : "Client's first name",
											type        : 'string',
											example     : 'John',
										},
										lastName          : {
											description : "Client's last name",
											type        : 'string',
											example     : 'Smith',
										},
										name              : {
											description : "firstName + '' + lastName",
											type        : 'string',
											example     : 'John Smith',
										},
										name2             : {
											description : "lastName + ', ' + firstName",
											type        : 'string',
											example     : 'Smith, John',
										},
										dateOfBirth       : {
											description : "Client's Date of Birth",
											type        : 'date',
											example     : '1950-10-11T00:00:00.000Z',
										},
										deceased          : {
											description : '',
											type        : 'boolean',
											example     : false,
										},
										address           : {
											description : '',
											type        : 'string',
											example     : '1 Station Street',
										},
										locality          : {
											description : '',
											type        : 'string',
											example     : 'Melboure',
										},
										state             : {
											description : '',
											type        : 'string',
											example     : 'VIC',
										},
										postcode          : {
											description : '',
											type        : 'string',
											example     : '3000',
										},
										serviceStartDate  : {
											description : '',
											type        : 'string',
											example     : '2017-10-24T00:00:00.000Z',
										},
										serviceFinishDate : {
											description : '',
											type        : 'string',
											example     : '2017-10-24T00:00:00.000Z',
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
		post : {
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
		},
	},
	'/api/client/{clientId}' : {
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
	},
};

module.exports = clientSwagger;
