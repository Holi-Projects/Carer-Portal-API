var carerAvailabilitySwagger = {
	'/api/carer/{carerId}/unavailability'      : {
		get  : {
			tags        : [ 'Carer' ],
			summary     : 'Carer Unavailability List',
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
										id            : {
											description : 'Unique ID for [Carers Unavailability] record',
											type        : 'integer',
											example     : '636',
										},
										startDate     : {
											description : '',
											type        : 'datetime',
											example     : '2017-10-24T00:00:00.000Z',
										},
										endDate       : {
											description : '',
											type        : 'datetime',
											example     : '2017-10-24T23:59:59.999Z',
										},
										text          : {
											description : 'Leave type name',
											type        : 'string',
											example     : 'Annual Leave',
										},
										eventType     : {
											description : 'Event type',
											type        : 'string',
											example     : 'Unavailability',
										},
										eventTypeCode : {
											description : 'Event type code',
											type        : 'integer',
											example     : '1',
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
			summary     : 'Insert Carer UnAvailability',
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
			requestBody : {
				required : true,
				content  : {
					'application/json' : {
						schema : {
							type       : 'object',
							properties : {
								id            : { description: '', type: 'integer', example: '' },
								carerId       : { description: '', type: 'integer', example: '' },
								startDate     : { description: '', type: 'string', example: '' },
								endDate       : { description: '', type: 'string', example: '' },
								comments      : { description: '', type: 'string', example: '' },
								leaveTypeId   : { description: '', type: 'string', example: '' },
								submittedDate : {
									description : 'Get current timestamp by default',
									type        : 'string',
									example     : '',
								},
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
								success : {
									description : '',
									type        : 'boolean',
									example     : true,
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
	'/api/carer/{carerId}/unavailability/{id}' : {
		get    : {
			tags        : [ 'Carer' ],
			summary     : 'Get Carer UnAvailability',
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
				{
					in          : 'path',
					name        : 'id',
					description : 'UnAvailability Id',
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
								type       : 'object',
								properties : {
									id                   : { description: '', type: 'integer', example: '' },
									carerId              : { description: '', type: 'integer', example: '' },
									startDate            : { description: '', type: 'string', example: '' },
									endDate              : { description: '', type: 'string', example: '' },
									comments             : { description: '', type: 'string', example: '' },
									leaveTypeId          : { description: '', type: 'string', example: '' },
									submittedDate        : { description: '', type: 'string', example: '' },
									approvedDate         : { description: '', type: 'string', example: '' },
									approvedByEmployeeID : { description: '', type: 'string', example: '' },
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
		put    : {
			tags        : [ 'Carer' ],
			summary     : 'Update Carer UnAvailability',
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
				{
					in          : 'path',
					name        : 'id',
					description : 'Unavailability Id',
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
								startDate     : { description: '', type: 'string', example: '' },
								endDate       : { description: '', type: 'string', example: '' },
								comments      : { description: '', type: 'string', example: '' },
								leaveTypeId   : { description: '', type: 'string', example: '' },
								submittedDate : { description: '', type: 'string', example: '' },
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
								type       : 'object',
								properties : {
									success : {
										description : '',
										type        : 'boolean',
										example     : true,
									},
									message : {
										description : '',
										type        : 'string',
										example     : 'Carer Availability updated successfully',
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
		delete : {
			tags        : [ 'Carer' ],
			summary     : 'Delete Carer UnAvailability',
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
				{
					in          : 'path',
					name        : 'id',
					description : 'UnAvailability Id',
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
								type       : 'object',
								properties : {
									success : {
										description : '',
										type        : 'boolean',
										example     : true,
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

module.exports = carerAvailabilitySwagger;
