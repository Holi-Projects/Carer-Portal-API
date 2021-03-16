var refSwagger = {
	'/api/ref/agency'   : {
		get : {
			tags        : [ 'Reference data' ],
			summary     : 'Agency List',
			description : 'List of Agencies',
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
										id   : {
											description : 'Unique ID for [Agencies] record',
											type        : 'integer',
											example     : 42,
										},
										name : {
											description : 'Agency name',
											type        : 'string',
											example     : 'Community Support Services',
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
	'/api/ref/client'   : {
		get : {
			tags        : [ 'Reference data' ],
			summary     : 'Client List',
			description : 'List of Clients',
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
										id   : {
											description : 'Unique ID for [Clients] record',
											type        : 'integer',
											example     : 100,
										},
										name : {
											description : 'Client name',
											type        : 'string',
											example     : 'John Smith',
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
	'/api/ref/employee' : {
		get : {
			tags        : [ 'Reference data' ],
			summary     : 'Employee List',
			description : 'List of Employees',
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
										id   : {
											description : 'Unique ID for [Employees] record',
											type        : 'integer',
											example     : 42,
										},
										name : {
											description : 'Employee name',
											type        : 'string',
											example     : 'Sally Staff',
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
	'/api/ref/language' : {
		get : {
			tags        : [ 'Reference data' ],
			summary     : 'Language List',
			description : 'List of Languages',
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
										id   : {
											description : 'Unique ID for language',
											type        : 'integer',
											example     : 35,
										},
										type : {
											description : 'Reference type',
											type        : 'string',
											example     : 'Language',
										},
										name : {
											description : 'Language name',
											type        : 'string',
											example     : 'Dutch',
										},
										code : {
											description : 'Language code',
											type        : 'string',
											example     : null,
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
	'/api/ref/skill'    : {
		get : {
			tags        : [ 'Reference data' ],
			summary     : 'Skills List',
			description : 'List of Skills ',
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
										id            : {
											description : 'Unique ID for [Skills] record',
											type        : 'integer',
											example     : 1,
										},
										name          : {
											description : 'Skill name',
											type        : 'string',
											example     : 'AGED CERT IV',
										},
										description   : {
											description : 'Skill description',
											type        : 'string',
											example     : 'CERT IV IN AGE CARE',
										},
										hasExpiryDate : {
											description : 'Indicator if the skill should have an expiryDate',
											type        : 'boolean',
											example     : true,
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
	'/api/ref/weekday'  : {
		get : {
			tags        : [ 'Reference data' ],
			summary     : 'Weekday List',
			description : 'List of Weekdays ',
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
											description : 'Unique ID for Weekday',
											type        : 'integer',
											example     : 1,
										},
										shortName : {
											description : 'Short name for Weekday',
											type        : 'string',
											example     : 'Sun',
										},
										name      : {
											description : 'Weekday name',
											type        : 'string',
											example     : 'Sunday',
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

module.exports = refSwagger;
