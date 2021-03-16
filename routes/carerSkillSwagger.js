var carerSkillSwagger = {
	'/api/carer/{carerId}/skill'      : {
		get  : {
			tags        : [ 'Carer' ],
			summary     : 'Carer Skills List',
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
										id                     : {
											description : 'Unique ID for [Carers Skills] record',
											type        : 'integer',
											example     : '1234',
										},
										skillId                : {
											description : 'Skill Id',
											type        : 'integer',
											example     : '1',
										},
										name                   : {
											description : 'Skill name (sourced from [Skills] table)',
											type        : 'string',
											example     : 'AGED CERT IV',
										},
										description            : {
											description : 'Skill description (sourced from [Skills] table)',
											type        : 'string',
											example     : 'CERT IV IN AGE CARE',
										},
										hasExpiryDate          : {
											description :
												'Indicator if the skill should have an expiryDate (sourced from [Skills] table)',
											type        : 'boolean',
											example     : true,
										},
										dateGained             : {
											description : 'Date the skill was gained',
											type        : 'string',
											example     : '2019-10-24T00:00:00.000Z',
										},
										expiryDate             : {
											description : 'Date the skill will expire',
											type        : 'string',
											example     : '2022-10-23T00:00:00.000Z',
										},
										referenceNo            : {
											description : 'Reference Number',
											type        : 'string',
											example     : 'CERT 1234',
										},
										comments               : {
											description : 'Comments regarding the skill',
											type        : 'string',
											example     : 'Example comments',
										},
										carerSubmittedDate     : {
											description : 'Date the skill was submitted to the system',
											type        : 'string',
											example     : '2019-10-24T00:00:00.000Z',
										},
										approvedDate           : {
											description : 'Date the skill was approved',
											type        : 'string',
											example     : '2022-10-23T00:00:00.000Z',
										},
										approvedByEmployeeId   : {
											description : 'ID of employee that approved the skill',
											type        : 'integer',
											example     : 1,
										},
										approvedByEmployeeName : {
											description : 'Name of employee that approved the skill',
											type        : 'String',
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
		post : {
			tags        : [ 'Carer' ],
			summary     : 'Insert Carer Skill',
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
								skillId       : {
									description : 'Skill Id',
									type        : 'integer',
									example     : '1',
								},
								name          : {
									description : 'Skill name (sourced from [Skills] table)',
									type        : 'string',
									example     : 'AGED CERT IV',
								},
								description   : {
									description : 'Skill description (sourced from [Skills] table)',
									type        : 'string',
									example     : 'CERT IV IN AGE CARE',
								},
								hasExpiryDate : {
									description :
										'Indicator if the skill should have an expiryDate (sourced from [Skills] table)',
									type        : 'boolean',
									example     : true,
								},
								dateGained    : {
									description : 'Date the skill was gained',
									type        : 'string',
									example     : '2019-10-24T00:00:00.000Z',
								},
								expiryDate    : {
									description : 'Date the skill will expire',
									type        : 'string',
									example     : '2022-10-23T00:00:00.000Z',
								},
								referenceNo   : {
									description : 'Reference Number',
									type        : 'string',
									example     : 'CERT 1234',
								},
								comments      : {
									description : 'Comments regarding the skill',
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
									example     : 'Carer Skill inserted successfully',
								},
								id      : {
									description : 'Unique ID for [Carers Skills] record',
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
	'/api/carer/{carerId}/skill/{id}' : {
		get    : {
			tags        : [ 'Carer' ],
			summary     : 'Get Carer Skill',
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
					description : 'Skill Id',
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
									id                   : {
										description : 'Unique ID for [Carers Skills] record',
										type        : 'integer',
										example     : '1234',
									},
									skillId              : {
										description : 'Skill Id',
										type        : 'integer',
										example     : '1',
									},
									dateGained           : {
										description : 'Date the skill was gained',
										type        : 'string',
										example     : '2019-10-24T00:00:00.000Z',
									},
									expiryDate           : {
										description : 'Date the skill will expire',
										type        : 'string',
										example     : '2022-10-23T00:00:00.000Z',
									},
									referenceNo          : {
										description : 'Reference Number',
										type        : 'string',
										example     : 'CERT 1234',
									},
									comments             : {
										description : 'Comments regarding the skill',
										type        : 'string',
										example     : 'Example comments',
									},
									carerSubmittedDate   : {
										description : 'Date the skill was submitted to the system',
										type        : 'string',
										example     : '2019-10-24T00:00:00.000Z',
									},
									approvedDate         : {
										description : 'Date the skill was approved',
										type        : 'string',
										example     : '2022-10-23T00:00:00.000Z',
									},
									approvedByEmployeeId : {
										description : 'ID of employee that approved the skill',
										type        : 'integer',
										example     : 1,
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
			summary     : 'Update Carer Skill',
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
					description : 'Skill Id',
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
								skillId              : {
									description : 'Skill Id',
									type        : 'integer',
									example     : '1',
								},
								dateGained           : {
									description : 'Date the skill was gained',
									type        : 'string',
									example     : '2019-10-24T00:00:00.000Z',
								},
								expiryDate           : {
									description : 'Date the skill will expire',
									type        : 'string',
									example     : '2022-10-23T00:00:00.000Z',
								},
								referenceNo          : {
									description : 'Reference Number',
									type        : 'string',
									example     : 'CERT 1234',
								},
								comments             : {
									description : 'Comments regarding the skill',
									type        : 'string',
									example     : 'Example comments',
								},
								carerSubmittedDate   : {
									description : 'Date the skill was submitted to the system',
									type        : 'string',
									example     : '2019-10-24T00:00:00.000Z',
								},
								approvedDate         : {
									description : 'Date the skill was approved',
									type        : 'string',
									example     : '2022-10-23T00:00:00.000Z',
								},
								approvedByEmployeeId : {
									description : 'ID of employee that approved the skill',
									type        : 'integer',
									example     : 1,
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
										example     : 'Carer Skill updated successfully',
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
			summary     : 'Delete Carer Skill',
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
					description : 'Skill Id',
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
										example     : 'Carer Skill deleted successfully',
									},
									id      : {
										description : 'Unique ID for [Carers Skills] record',
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

module.exports = carerSkillSwagger;
