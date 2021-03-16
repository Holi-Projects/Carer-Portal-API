var carerSwagger = {
	'/api/carer'                           : {
		get  : {
			tags        : [ 'Carer' ],
			summary     : 'List Carers',
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
									type       : 'object',
									properties : {
										id        : {
											description : 'unique ID of Carer',
											type        : 'integer',
											example     : '1',
										},
										firstName : {
											description : "Carer's first name",
											type        : 'string',
											example     : 'John',
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
			tags        : [ 'Carer' ],
			summary     : 'Create Carer',
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
								$ref : '#/components/schemas/carer',
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
	'/api/carer/{carerId}'                 : {
		get : {
			tags        : [ 'Carer' ],
			summary     : 'Carer Details',
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
					name        : 'carerId',
					description : 'Carer Id',
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
								$ref : '#/components/schemas/carer',
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
			tags        : [ 'Carer' ],
			summary     : 'Update Carer Details',
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
					name        : 'carerId',
					description : 'Carer Id',
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
								firstName                : { description: '', type: 'string', example: '' },
								lastName                 : { description: '', type: 'string', example: '' },
								address                  : { description: '', type: 'string', example: '' },
								locality                 : { description: '', type: 'string', example: '' },
								state                    : { description: '', type: 'string', example: '' },
								postcode                 : { description: '', type: 'string', example: '' },
								country                  : { description: '', type: 'string', example: '' },
								businessPhone            : { description: '', type: 'string', example: '' },
								homePhone                : { description: '', type: 'string', example: '' },
								mobile                   : { description: '', type: 'string', example: '' },
								faxNumber                : { description: '', type: 'string', example: '' },
								email                    : { description: '', type: 'string', example: '' },
								jobTitle                 : { description: '', type: 'string', example: '' },
								gender                   : { description: '', type: 'boolean', example: '' },
								dateOfBirth              : { description: '', type: 'date', example: '' },
								deceased                 : { description: '', type: 'boolean', example: '' },
								transportMode            : { description: '', type: 'string', example: '' },
								notes                    : { description: '', type: 'string', example: '' },
								medicalNotes             : { description: '', type: 'string', example: '' },
								skills                   : { description: '', type: 'string', example: '' },
								company                  : { description: '', type: 'string', example: '' },
								ABN                      : { description: '', type: 'string', example: '' },
								taxFileNo                : { description: '', type: 'string', example: '' },
								webPage                  : { description: '', type: 'string', example: '' },
								emergencyName            : { description: '', type: 'string', example: '' },
								emergencyPhone           : { description: '', type: 'string', example: '' },
								emergencyMobile          : { description: '', type: 'string', example: '' },
								emergencyEmail           : { description: '', type: 'string', example: '' },
								availableFromDate        : { description: '', type: 'date', example: '' },
								availableToDate          : { description: '', type: 'date', example: '' },
								availableComments        : { description: '', type: 'string', example: '' },
								availableSchoolHolidays  : { description: '', type: 'boolean', example: '' },
								available24hrShifts      : { description: '', type: 'boolean', example: '' },
								availableOvernightShifts : { description: '', type: 'boolean', example: '' },
								notAvailableFromDate     : { description: '', type: 'date', example: '' },
								notAvailableToDate       : { description: '', type: 'date', example: '' },
								notAvailableComments     : { description: '', type: 'string', example: '' },
								preferredContactMethod   : { description: '', type: 'string', example: '' },
								photoFileName            : { description: '', type: 'string', example: '' },
								attachmentsPath          : { description: '', type: 'string', example: '' },
								cardId                   : { description: '', type: 'string', example: '' },
								nurse                    : { description: '', type: 'boolean', example: '' },
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
								$ref : '#/components/schemas/carer',
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
	'/api/carer/{carerId}/unavailable'     : {
		get : {
			tags        : [ 'Carer' ],
			summary     : 'List Carer Unavailablity periods',
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
					name        : 'carerId',
					description : 'Carer Id',
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
										startDateTime : {
											description : '',
											type        : 'datetime',
											example     : '2017-10-24T00:00:00.000Z',
										},
										endDateTime   : {
											description : '',
											type        : 'datetime',
											example     : '2017-10-24T23:59:59.999Z',
										},
										reason        : {
											description : '',
											type        : 'string',
											example     : 'Holidays',
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
	// '/api/carer/{carerId}/unavailability'  : {
	// 	get : {
	// 		tags        : [ 'Carer' ],
	// 		summary     : 'List Carer Unavailablity periods',
	// 		description : '',
	// 		security    : [ 'ApiKeyAuth' ],
	// 		parameters  : [
	// 			{
	// 				in          : 'header',
	// 				name        : 'x-access-token',
	// 				description : 'Access Token',
	// 				schema      : {
	// 					type : 'string',
	// 				},
	// 				required    : true,
	// 			},
	// 			{
	// 				in          : 'path',
	// 				name        : 'carerId',
	// 				description : 'Carer Id',
	// 				schema      : {
	// 					type : 'string',
	// 				},
	// 				required    : true,
	// 			},
	// 			{
	// 				in          : 'query',
	// 				name        : 'date',
	// 				description : 'Selected Date (format: YYYY-MM-DD) (default value: today)',
	// 				schema      : {
	// 					type : 'string',
	// 				},
	// 				required    : false,
	// 			},
	// 			{
	// 				in          : 'query',
	// 				name        : 'view',
	// 				description : 'View Type (e.g: month, week, agenda)(default value: month)',
	// 				schema      : {
	// 					type : 'string',
	// 				},
	// 				required    : false,
	// 			},
	// 		],
	// 		responses   : {
	// 			200 : {
	// 				description : 'OK',
	// 				content     : {
	// 					'application/json' : {
	// 						schema : {
	// 							type  : 'array',
	// 							items : {
	// 								//$ref : '#/components/schemas/carer',
	// 								type       : 'object',
	// 								properties : {
	// 									startDateTime : {
	// 										description : '',
	// 										type        : 'datetime',
	// 										example     : '2017-10-24T00:00:00.000Z',
	// 									},
	// 									endDateTime   : {
	// 										description : '',
	// 										type        : 'datetime',
	// 										example     : '2017-10-24T23:59:59.999Z',
	// 									},
	// 									reason        : {
	// 										description : '',
	// 										type        : 'string',
	// 										example     : 'Holidays',
	// 									},
	// 								},
	// 							},
	// 						},
	// 					},
	// 				},
	// 			},
	// 			403 : {
	// 				description : 'Error: Forbidden',
	// 				content     : {
	// 					'application/json' : {
	// 						schema : {
	// 							$ref : '#/components/schemas/error',
	// 						},
	// 					},
	// 				},
	// 			},
	// 		},
	// 	},
	// },
	// '/api/carer/{carerId}/unavailable-day' : {
	// 	get : {
	// 		tags        : [ 'Carer' ],
	// 		summary     : 'List Carer Unavailablity periods',
	// 		description : '',
	// 		security    : [ 'ApiKeyAuth' ],
	// 		parameters  : [
	// 			{
	// 				in          : 'header',
	// 				name        : 'x-access-token',
	// 				description : 'Access Token',
	// 				schema      : {
	// 					type : 'string',
	// 				},
	// 				required    : true,
	// 			},
	// 			{
	// 				in          : 'path',
	// 				name        : 'carerId',
	// 				description : 'Carer Id',
	// 				schema      : {
	// 					type : 'string',
	// 				},
	// 				required    : true,
	// 			},
	// 			{
	// 				in          : 'query',
	// 				name        : 'date',
	// 				description : 'Selected Date (format: YYYY-MM-DD) (default value: today)',
	// 				schema      : {
	// 					type : 'string',
	// 				},
	// 				required    : false,
	// 			},
	// 			{
	// 				in          : 'query',
	// 				name        : 'view',
	// 				description : 'View Type (e.g: month, week, agenda)(default value: month)',
	// 				schema      : {
	// 					type : 'string',
	// 				},
	// 				required    : false,
	// 			},
	// 		],
	// 		responses   : {
	// 			200 : {
	// 				description : 'OK',
	// 				content     : {
	// 					'application/json' : {
	// 						schema : {
	// 							type  : 'array',
	// 							items : {
	// 								//$ref : '#/components/schemas/carer',
	// 								type : 'string',
	// 							},
	// 						},
	// 					},
	// 				},
	// 			},
	// 			403 : {
	// 				description : 'Error: Forbidden',
	// 				content     : {
	// 					'application/json' : {
	// 						schema : {
	// 							$ref : '#/components/schemas/error',
	// 						},
	// 					},
	// 				},
	// 			},
	// 		},
	// 	},
	// },
	'/api/carer/{carerId}/calendar'        : {
		get : {
			tags        : [ 'Carer' ],
			summary     : 'List Events',
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
									properties : {},
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

module.exports = carerSwagger;
