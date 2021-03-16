var agencySwagger = {
	'/api/agency'                    : {
		get : {
			tags        : [ 'Agency' ],
			summary     : 'List Agencies',
			description : '',
			security    : [ 'bearerAuth' ],
			/*security    : [ 'ApiKeyAuth' ],*/
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
										id               : {
											description : 'unique ID of Agency',
											type        : 'integer',
											example     : '1',
										},
										name             : {
											description : 'Agency name',
											type        : 'string',
											example     : 'AAA Aged Care Services',
										},
										address          : {
											description : '',
											type        : 'string',
											example     : '1 Station Street',
										},
										locality         : {
											description : '',
											type        : 'string',
											example     : 'MELBOURNE',
										},
										state            : {
											description : '',
											type        : 'string',
											example     : 'VIC',
										},
										postcode         : {
											description : '',
											type        : 'string',
											example     : '3000',
										},
										businessPhone    : {
											description : '',
											type        : 'string',
											example     : '0312345678',
										},
										cardId           : {
											description : '',
											type        : 'string',
											example     : 'AAA',
										},
										pricinGroupId    : {
											description : '',
											type        : 'integer',
											example     : '4',
										},
										pricingGroupName : {
											description : '',
											type        : 'string',
											example     : 'Standard Agency',
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
	},
	'/api/agency/{agencyId}'         : {
		get : {
			tags        : [ 'Agency' ],
			summary     : 'Agency Details',
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
					name        : 'agencyId',
					description : 'Agency ID',
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
								$ref : '#/components/schemas/agency',
							},
						},
					},
				},
				403 : {
					description : 'Error: Forbidden',
				},
			},
		},
	},
	'/api/agency/{agencyId}/contact' : {
		get : {
			tags        : [ 'Agency' ],
			summary     : 'Agency Contact List',
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
					name        : 'agencyId',
					description : 'Agency Id',
					schema      : {
						type : 'string',
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
										id              : {
											description : 'Contact Id',
											type        : 'integer',
											example     : 99,
										},
										firstName       : {
											description : '',
											type        : 'string',
											example     : 'Fred',
										},
										lastName        : {
											description : '',
											type        : 'string',
											example     : 'Nerks',
										},
										name            : {
											description : '',
											type        : 'string',
											example     : 'Fred Nerks',
										},
										contactJobTitle : {
											description : '',
											type        : 'string',
											example     : '',
										},
										businessPhone   : {
											description : '',
											type        : 'string',
											example     : '0311112222',
										},
										mobile          : {
											description : '',
											type        : 'string',
											example     : '0400100200',
										},
										email           : {
											description : '',
											type        : 'string',
											example     : 'fred@example.com',
										},
										notes           : {
											description : '',
											type        : 'string',
											example     : 'Example notes',
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
	'/api/agency/{agencyId}/client'  : {
		get : {
			tags        : [ 'Agency' ],
			summary     : 'Agency Client List',
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
					name        : 'agencyId',
					description : 'Agency Id',
					schema      : {
						type : 'string',
					},
					required    : true,
				},
				{
					in          : 'query',
					name        : 'activeOnly',
					description : 'Return only active carers',
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
									//$ref : '#/components/schemas/carer',
									type       : 'object',
									properties : {
										id                  : {
											description : 'Agency-Client Id',
											type        : 'integer',
											example     : '1',
										},
										clientId            : {
											description : 'Client Id',
											type        : 'integer',
											example     : '1',
										},
										clientName          : {
											description : '',
											type        : 'string',
											example     : 'Bruce Baxter',
										},
										payerId             : {
											description : 'Client Id Payer',
											type        : 'integer',
											example     : '2',
										},
										payerName           : {
											description : '',
											type        : 'string',
											example     : 'Bob Baxter',
										},
										jobRef              : {
											description : '',
											type        : 'string',
											example     : 'X-123',
										},
										agencyContactId     : {
											description : '',
											type        : 'integer',
											example     : 99,
										},
										agencyContactName   : {
											description : '',
											type        : 'string',
											example     : 'Mr Fred Nerks',
										},
										taskId              : {
											description : '',
											type        : 'integer',
											example     : 10,
										},
										taskName            : {
											description : '',
											type        : 'string',
											example     : '',
										},
										cardId              : {
											description : '',
											type        : 'string',
											example     : 'ABC123',
										},
										budget              : {
											description : '',
											type        : 'string',
											example     : '1000',
										},
										budgetWarningLevel  : {
											description : '',
											type        : 'string',
											example     : '100',
										},
										budgetWarningRef    : {
											description : '',
											type        : 'string',
											example     : 'BUD1000',
										},
										purchaseOrderNumber : {
											description : '',
											type        : 'string',
											example     : 'PO-1234',
										},
										serviceStartDate    : {
											description : '',
											type        : 'string',
											example     : '2015-12-17T00:00:00.000Z',
										},
										serviceFinishDate   : {
											description : '',
											type        : 'string',
											example     : '2019-12-17T00:00:00.000Z',
										},
										comments            : {
											description : '',
											type        : 'string',
											example     : 'Example comments',
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

module.exports = agencySwagger;
