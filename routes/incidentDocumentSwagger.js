var incidentDocumentSwagger = {
	'/api/incident/document'      : {
		get  : {
			tags        : [ 'Incident' ],
			summary     : 'Incident Documents List',
			description : `# Retrieve a list of Incident Documents.\n
			Returns a list of objects corresponding to documents related to the Incident. 
			Each object has an id, which can be used for subsequent calls to download, update or delete the record and/or the file. 
			To get a list of documents related to an Incident, use the incidentId query parameter.\n
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
					in          : 'query',
					name        : 'incidentId',
					description : 'Filter by Incident',
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
											description : 'Unique ID for [Incidents Documents] record',
											type        : 'integer',
											example     : '1234',
										},
										incidentId   : {
											description : 'Incident ID',
											type        : 'integer',
											example     : '1',
										},
										name         : {
											description : 'Document name',
											type        : 'string',
											example     : 'situation.jpg',
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
											description : 'File type',
											type        : 'string',
											example     : '.pdf',
										},
										dateUploaded : {
											description : 'Date and time the file was uploaded',
											type        : 'date',
											example     : '',
										},
										injury       : {
											description : 'Indicator if file is related to an Injury Claim',
											type        : 'booleam',
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
		post : {
			tags        : [ 'Incident' ],
			summary     : 'Upload Incident Document',
			description : `# Upload a Incident's Document.\n
			Upload a file and create the associated [Incidents Documents] record. 
			Use the incidentId query parameter to specify the Incident the file is related to.`,
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
					name        : 'incidentId',
					description : 'Associate file to Incident',
					schema      : {
						type : 'integer',
					},
					required    : true,
				},
			],
			/*requestBody : {
				required : true,
				content  : {
					'application/json' : {
						schema : {
							type       : 'object',
							properties : {
								incidentId    : {
									description : 'Incident ID',
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
									example     : 'Incident Document inserted successfully',
								},
								id      : {
									description : 'Unique ID for [Incidents Documents] record',
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
	'/api/incident/document/{id}' : {
		get    : {
			tags        : [ 'Incident' ],
			summary     : 'Download Incident Document',
			description : `# Download a Incident's Document.\n
			Download a file related to an incident.`,
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
										id           : {
											description : 'Unique ID for [Incidents Documents] record',
											type        : 'integer',
											example     : '1234',
										},
										incidentId   : {
											description : 'Incident ID',
											type        : 'integer',
											example     : '1',
										},
										name         : {
											description : 'Document name',
											type        : 'string',
											example     : 'situation.jpg',
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
											description : 'File type',
											type        : 'string',
											example     : '.pdf',
										},
										dateUploaded : {
											description : 'Date and time the file was uploaded',
											type        : 'date',
											example     : '',
										},
										injury       : {
											description : 'Indicator if file is related to an Injury Claim',
											type        : 'booleam',
											example     : true,
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
		put    : {
			tags        : [ 'Incident' ],
			summary     : 'Update Incident Document',
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
								name   : {
									description : 'Document name',
									type        : 'string',
									example     : 'situation.jpg',
								},
								injury : {
									description : 'Incident ID',
									type        : 'boolean',
									example     : false,
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
										example     : 'Incident Document updated successfully',
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
			tags        : [ 'Incident' ],
			summary     : 'Delete Incident Document',
			description : 'Delete a [Incidents Document] record and the associated file.',
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
										example     : 'Incident Document deleted successfully',
									},
									id      : {
										description : 'Unique ID for [Incidents Documents] record',
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

module.exports = incidentDocumentSwagger;
