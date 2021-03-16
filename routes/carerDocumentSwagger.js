var carerDocumentSwagger = {
	'/api/carer/{carerId}/document'      : {
		get  : {
			tags        : [ 'Carer' ],
			summary     : 'Carer Documents List',
			description : `# Retrieve a list of Carer's Documents.\n
			Returns a list of objects corresponding to documents related to the Carer. 
			Each object has an id, which can be used for subsequent calls to download, update or delete the record and/or the file. 
			To get a list of documents related to a (carer’s) Skill or Incident, use either the carerSkillId or incidentId query parameter.\n
			Internals:\n
			`,
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
				{
					in          : 'query',
					name        : 'incidentId',
					description : 'Filter by Incident',
					schema      : {
						type : 'integer',
					},
					required    : false,
				},
				{
					in          : 'query',
					name        : 'carerSkillId',
					description : 'Filter by Skill',
					schema      : {
						type : 'integer',
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
										id           : {
											description : 'Unique ID for [Carers Documents] record',
											type        : 'integer',
											example     : '1234',
										},
										carerId      : {
											description : 'Carer ID',
											type        : 'integer',
											example     : '1',
										},
										name         : {
											description : 'Document name',
											type        : 'string',
											example     : 'Certificate.pdf',
										},
										incidentId   : {
											description : 'Incident ID',
											type        : 'integer',
											example     : '1',
										},
										carerSkillId : {
											description : 'Carer Skill ID',
											type        : 'integer',
											example     : '1',
										},
										size         : {
											description : 'Document size in bytes',
											type        : 'integer',
											example     : '1234',
										},
										dateModified : {
											description : 'Date and time the file was last modified',
											type        : 'date',
											example     : '',
										},
										type         : {
											deccription : 'File type',
											type        : 'string',
											example     : '.pdf',
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
			summary     : 'Upload Carer Document',
			description : `# Upload a Carer's Document.\n
			Upload a file and create the associated [Carers Documents] record. 
			To upload a file related to a Skill or incident, use either the carerSkillId or incidentId query parameter.`,
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
					in          : 'query',
					name        : 'incidentId',
					description : 'Associate file to Incident',
					schema      : {
						type : 'integer',
					},
					required    : false,
				},
				{
					in          : 'query',
					name        : 'carerSkillId',
					description : 'Associate file to Skill',
					schema      : {
						type : 'integer',
					},
					required    : false,
				},
			],
			/*requestBody : {
				required : true,
				content  : {
					'application/json' : {
						schema : {
							type       : 'object',
							properties : {
								carerId    : {
									description : 'Carer ID',
									type        : 'integer',
									example     : '1',
								},
								name       : {
									description : 'Document name',
									type        : 'string',
									example     : 'Certificate.pdf',
								},
								incidentId : {
									description : 'Incident ID',
									type        : 'integer',
									example     : '1',
								},
								skillId    : {
									description : 'Skill ID',
									type        : 'integer',
									example     : '1',
								},
							},
						},
					},
				},
			},*/
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
									example     : 'Carer Document inserted successfully',
								},
								id      : {
									description : 'Unique ID for [Carers Documents] record',
									type        : 'integer',
									example     : 1234,
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
	'/api/carer/{carerId}/document/{id}' : {
		get    : {
			tags        : [ 'Carer' ],
			summary     : 'Download Carer Document',
			description : `# Download a Carer's Document.\n
			Upload a file and create the associated [Carers Documents] record. 
			To upload a file related to a Skill or incident, use either the carerSkillId or incidentId query parameter.`,
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
					description : 'Document Id',
					schema      : {
						type : 'string',
					},
					required    : true,
				},
			],
			responses   : {
				200 : {
					description : 'OK',
					/*content     : {
						'application/json' : {
							schema : {
								type       : 'object',
								properties : {
									id         : {
										description : 'Unique ID for [Carers Documents] record',
										type        : 'integer',
										example     : '1234',
									},
									carerId    : {
										description : 'Carer ID',
										type        : 'integer',
										example     : '1',
									},
									name       : {
										description : 'Document name',
										type        : 'string',
										example     : 'Certificate.pdf',
									},
									incidentId : {
										description : 'Incident ID',
										type        : 'integer',
										example     : '1',
									},
									skillId    : {
										description : 'Skill ID',
										type        : 'integer',
										example     : '1',
									},
								},
							},
						},
					},*/
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
		/*put    : {
			tags        : [ 'Carer' ],
			summary     : 'Update Carer Document',
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
					description : 'Document Id',
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
								id         : {
									description : 'Unique ID for [Carers Documents] record',
									type        : 'integer',
									example     : '1234',
								},
								carerId    : {
									description : 'Carer ID',
									type        : 'integer',
									example     : '1',
								},
								name       : {
									description : 'Document name',
									type        : 'string',
									example     : 'Certificate.pdf',
								},
								incidentId : {
									description : 'Incident ID',
									type        : 'integer',
									example     : '1',
								},
								skillId    : {
									description : 'Skill ID',
									type        : 'integer',
									example     : '1',
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
										example     : 'Carer Document updated successfully',
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
		},*/
		delete : {
			tags        : [ 'Carer' ],
			summary     : 'Delete Carer Document',
			description : 'Delete a [Carers Document] record and the associated file.',
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
					description : 'Document Id',
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
										example     : 'Carer Document deleted successfully',
									},
									id      : {
										description : 'Unique ID for [Carers Documents] record',
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

module.exports = carerDocumentSwagger;
