var carerAvailabilitySwagger = {
	'/api/carer/{carerId}/availability'      : {
		get  : {
			tags        : [ 'Carer' ],
			summary     : 'Carer Availability List',
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
										id                      : {
											description : 'Unique ID for [Carers Availability] record',
											type        : 'integer',
											example     : '636',
										},
										weekDay                 : {
											description : 'Numbered day of the week (Sunday = 1)',
											type        : 'integer',
											example     : '2',
										},
										day                     : {
											description : 'Name of the day',
											type        : 'string',
											example     : 'Monday',
										},
										startTime               : {
											description : '',
											type        : 'date',
											example     : '1899-12-30T12:00:00.000Z',
										},
										endTime                 : {
											description : '',
											type        : 'date',
											example     : '1899-12-30T12:00:00.000Z',
										},
										available24hrShift      : {
											description : 'Indicator if available for 24 hour shifts',
											type        : 'boolean',
											example     : true,
										},
										availableOvernightShift : {
											description : 'Indicator if available for overnight shifts',
											type        : 'boolean',
											example     : true,
										},
										comments                : {
											description : 'Comments regarding the availability',
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
		post : {
			tags        : [ 'Carer' ],
			summary     : 'Insert Carer Availability',
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
								weekDay                 : {
									description : 'Numbered day of the week (Sunday = 1)',
									type        : 'integer',
									example     : '2',
								},
								startTime               : {
									description : '',
									type        : 'date',
									example     : '1899-12-30T12:00:00.000Z',
								},
								endTime                 : {
									description : '',
									type        : 'date',
									example     : '1899-12-30T12:00:00.000Z',
								},
								available24hrShift      : {
									description : 'Indicator if available for 24 hour shifts',
									type        : 'boolean',
									example     : true,
								},
								availableOvernightShift : {
									description : 'Indicator if available for overnight shifts',
									type        : 'boolean',
									example     : true,
								},
								comments                : {
									description : 'Comments regarding the availability',
									type        : 'string',
									example     : 'Example comments',
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
								message : {
									description : '',
									type        : 'string',
									example     : 'Carer Availability inserted successfully',
								},
								id      : {
									description : 'Unique ID for [Carers Availabilitys] record',
									type        : 'integer',
									example     : '1234',
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
	'/api/carer/{carerId}/availability/{id}' : {
		get    : {
			tags        : [ 'Carer' ],
			summary     : 'Get Carer Availability',
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
					description : 'Availability Id',
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
									id                      : {
										description : 'Unique ID for [Carers Availability] record',
										type        : 'integer',
										example     : '636',
									},
									weekDay                 : {
										description : 'Numbered day of the week (Sunday = 1)',
										type        : 'integer',
										example     : '2',
									},
									startTime               : {
										description : '',
										type        : 'date',
										example     : '1899-12-30T12:00:00.000Z',
									},
									endTime                 : {
										description : '',
										type        : 'date',
										example     : '1899-12-30T12:00:00.000Z',
									},
									available24hrShift      : {
										description : 'Indicator if available for 24 hour shifts',
										type        : 'boolean',
										example     : true,
									},
									availableOvernightShift : {
										description : 'Indicator if available for overnight shifts',
										type        : 'boolean',
										example     : true,
									},
									comments                : {
										description : 'Comments regarding the availability',
										type        : 'string',
										example     : 'Example comments',
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
		put    : {
			tags        : [ 'Carer' ],
			summary     : 'Update Carer Availability',
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
					description : 'Availability Id',
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
								weekDay                 : {
									description : 'Numbered day of the week (Sunday = 1)',
									type        : 'integer',
									example     : '2',
								},
								startTime               : {
									description : '',
									type        : 'date',
									example     : '1899-12-30T12:00:00.000Z',
								},
								endTime                 : {
									description : '',
									type        : 'date',
									example     : '1899-12-30T12:00:00.000Z',
								},
								available24hrShift      : {
									description : 'Indicator if available for 24 hour shifts',
									type        : 'boolean',
									example     : true,
								},
								availableOvernightShift : {
									description : 'Indicator if available for overnight shifts',
									type        : 'boolean',
									example     : true,
								},
								comments                : {
									description : 'Comments regarding the availability',
									type        : 'string',
									example     : 'Example comments',
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
			summary     : 'Delete Carer Availability',
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
					description : 'Availability Id',
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
									message : {
										description : '',
										type        : 'string',
										example     : 'Carer Availability deleted successfully',
									},
									id      : {
										description : 'Unique ID for [Carers Availabilitys] record',
										type        : 'integer',
										example     : '1234',
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
