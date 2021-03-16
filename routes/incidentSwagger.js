var incidentSwagger = {
	'/api/incident'      : {
		get  : {
			tags        : [ 'Incident' ],
			summary     : 'Incidents List',
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
					name        : 'employeeId',
					description : 'Employee Id',
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
										id                           : {
											description : 'Unique ID for [Incidents] record',
											type        : 'integer',
											example     : '1234',
										},
										carerId                      : {
											description : '',
											type        : 'integer',
											example     : 42,
										},
										carerName                    : {
											description : '',
											type        : 'string',
											example     : 'Anna La Barba',
										},
										employeeId                   : {
											description : '',
											type        : 'integer',
											example     : 56,
										},
										employeeName                 : {
											description : '',
											type        : 'string',
											example     : 'Reinier Lolkema',
										},
										clientId                     : {
											description : '',
											type        : 'integer',
											example     : 14795,
										},
										clientName                   : {
											description : '',
											type        : 'string',
											example     : 'Elizabeth Alexander',
										},
										otherPartyName               : {
											description : '',
											type        : 'string',
											example     : 'other party name',
										},
										incidentDateTime             : {
											description : '',
											type        : 'date',
											example     : '2020-10-01T14:00:00.000Z',
										},
										incidentLocation             : {
											description : '',
											type        : 'string',
											example     : 'incident location',
										},
										incidentAddress              : {
											description : '',
											type        : 'string',
											example     : 'incident address',
										},
										injuredNextOfKin             : {
											description : '',
											type        : 'string',
											example     : 'injured next of kin',
										},
										witnesses                    : {
											description : '',
											type        : 'string',
											example     : 'witnesses',
										},
										facts                        : {
											description : '',
											type        : 'string',
											example     : 'facts',
										},
										workDescription              : {
											description : '',
											type        : 'string',
											example     : 'work description',
										},
										injury                       : {
											description : '',
											type        : 'boolean',
											example     : true,
										},
										sharpsExposure               : {
											description : '',
											type        : 'boolean',
											example     : true,
										},
										doctorNotified               : {
											description : '',
											type        : 'boolean',
											example     : true,
										},
										doctorAttended               : {
											description : '',
											type        : 'boolean',
											example     : true,
										},
										doctorName                   : {
											description : '',
											type        : 'string',
											example     : 'doctor name',
										},
										policeNotified               : {
											description : '',
											type        : 'boolean',
											example     : true,
										},
										policeAttended               : {
											description : '',
											type        : 'boolean',
											example     : true,
										},
										treatment                    : {
											description : '',
											type        : 'string',
											example     : 'treatment',
										},
										submittedDateTime            : {
											description : '',
											type        : 'date',
											example     : '2020-10-01T15:00:00.000Z',
										},
										approvedDateTime             : {
											description : '',
											type        : 'date',
											example     : '2020-10-01T16:00:00.000Z',
										},
										approvedByEmployeeId         : { description: '', type: 'integer', example: 8 },
										approvedByEmployeeName       : {
											description : '',
											type        : 'string',
											example     : 'Denis Treacy',
										},
										officeComments               : {
											description : '',
											type        : 'string',
											example     : 'office comments',
										},
										injuryClaimSubmittedDateTime : {
											description : '',
											type        : 'date',
											example     : '2020-10-01T17:00:00.000Z',
										},
										injuryClaimApprovedDateTime  : {
											description : '',
											type        : 'date',
											example     : '2020-10-01T18:00:00.000Z',
										},
										injuryClaimRefNo             : {
											description : '',
											type        : 'string',
											example     : 'injury claim ref no',
										},
										injuryClaimComments          : {
											description : '',
											type        : 'string',
											example     : 'injury claim comments',
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
			summary     : 'Insert Incident',
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
								carerId          : {
									description : '',
									type        : 'integer',
									example     : 42,
								},
								employeeId       : {
									description : '',
									type        : 'integer',
									example     : 56,
								},
								clientId         : {
									description : '',
									type        : 'integer',
									example     : 14795,
								},
								otherPartyName   : {
									description : '',
									type        : 'string',
									example     : 'other party name',
								},
								incidentDateTime : {
									description : '',
									type        : 'date',
									example     : '2020-10-01T14:00:00.000Z',
								},
								incidentLocation : {
									description : '',
									type        : 'string',
									example     : 'incident location',
								},
								incidentAddress  : {
									description : '',
									type        : 'string',
									example     : 'incident address',
								},
								injuredNextOfKin : {
									description : '',
									type        : 'string',
									example     : 'injured next of kin',
								},
								witnesses        : {
									description : '',
									type        : 'string',
									example     : 'witnesses',
								},
								facts            : {
									description : '',
									type        : 'string',
									example     : 'facts',
								},
								workDescription  : {
									description : '',
									type        : 'string',
									example     : 'work description',
								},
								injury           : {
									description : '',
									type        : 'boolean',
									example     : true,
								},
								sharpsExposure   : {
									description : '',
									type        : 'boolean',
									example     : true,
								},
								doctorNotified   : {
									description : '',
									type        : 'boolean',
									example     : true,
								},
								doctorAttended   : {
									description : '',
									type        : 'boolean',
									example     : true,
								},
								doctorName       : {
									description : '',
									type        : 'string',
									example     : 'doctor name',
								},
								policeNotified   : {
									description : '',
									type        : 'boolean',
									example     : true,
								},
								policeAttended   : {
									description : '',
									type        : 'boolean',
									example     : true,
								},
								treatment        : {
									description : '',
									type        : 'string',
									example     : 'treatment',
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
									example     : 'Incident inserted successfully',
								},
								id      : {
									description : 'Unique ID for [Incidents] record',
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
	'/api/incident/{id}' : {
		get    : {
			tags        : [ 'Incident' ],
			summary     : 'Get Incident',
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
					description : 'Incident Id',
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
									id                           : {
										description : 'Unique ID for [Incidents] record',
										type        : 'integer',
										example     : '1234',
									},
									carerId                      : {
										description : '',
										type        : 'integer',
										example     : 42,
									},
									employeeId                   : {
										description : '',
										type        : 'integer',
										example     : 56,
									},
									clientId                     : {
										description : '',
										type        : 'integer',
										example     : 14795,
									},
									otherPartyName               : {
										description : '',
										type        : 'string',
										example     : 'other party name',
									},
									incidentDateTime             : {
										description : '',
										type        : 'date',
										example     : '2020-10-01T14:00:00.000Z',
									},
									incidentLocation             : {
										description : '',
										type        : 'string',
										example     : 'incident location',
									},
									incidentAddress              : {
										description : '',
										type        : 'string',
										example     : 'incident address',
									},
									injuredNextOfKin             : {
										description : '',
										type        : 'string',
										example     : 'injured next of kin',
									},
									witnesses                    : {
										description : '',
										type        : 'string',
										example     : 'witnesses',
									},
									facts                        : {
										description : '',
										type        : 'string',
										example     : 'facts',
									},
									workDescription              : {
										description : '',
										type        : 'string',
										example     : 'work description',
									},
									injury                       : {
										description : '',
										type        : 'boolean',
										example     : true,
									},
									sharpsExposure               : {
										description : '',
										type        : 'boolean',
										example     : true,
									},
									doctorNotified               : {
										description : '',
										type        : 'boolean',
										example     : true,
									},
									doctorAttended               : {
										description : '',
										type        : 'boolean',
										example     : true,
									},
									doctorName                   : {
										description : '',
										type        : 'string',
										example     : 'doctor name',
									},
									policeNotified               : {
										description : '',
										type        : 'boolean',
										example     : true,
									},
									policeAttended               : {
										description : '',
										type        : 'boolean',
										example     : true,
									},
									treatment                    : {
										description : '',
										type        : 'string',
										example     : 'treatment',
									},
									submittedDateTime            : {
										description : '',
										type        : 'date',
										example     : '2020-10-01T15:00:00.000Z',
									},
									approvedDateTime             : {
										description : '',
										type        : 'date',
										example     : '2020-10-01T16:00:00.000Z',
									},
									approvedByEmployeeId         : {
										description : '',
										type        : 'integer',
										example     : 8,
									},
									officeComments               : {
										description : '',
										type        : 'string',
										example     : 'office comments',
									},
									injuryClaimSubmittedDateTime : {
										description : '',
										type        : 'date',
										example     : '2020-10-01T17:00:00.000Z',
									},
									injuryClaimApprovedDateTime  : {
										description : '',
										type        : 'date',
										example     : '2020-10-01T18:00:00.000Z',
									},
									injuryClaimRefNo             : {
										description : '',
										type        : 'string',
										example     : 'injury claim ref no',
									},
									injuryClaimComments          : {
										description : '',
										type        : 'string',
										example     : 'injury claim comments',
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
			tags        : [ 'Incident' ],
			summary     : 'Update Incident',
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
					description : 'Incident Id',
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
								carerId                      : {
									description : '',
									type        : 'integer',
									example     : 42,
								},
								employeeId                   : {
									description : '',
									type        : 'integer',
									example     : 56,
								},
								clientId                     : {
									description : '',
									type        : 'integer',
									example     : 14795,
								},
								otherPartyName               : {
									description : '',
									type        : 'string',
									example     : 'other party name',
								},
								incidentDateTime             : {
									description : '',
									type        : 'date',
									example     : '2020-10-01T14:00:00.000Z',
								},
								incidentLocation             : {
									description : '',
									type        : 'string',
									example     : 'incident location',
								},
								incidentAddress              : {
									description : '',
									type        : 'string',
									example     : 'incident address',
								},
								injuredNextOfKin             : {
									description : '',
									type        : 'string',
									example     : 'injured next of kin',
								},
								witnesses                    : {
									description : '',
									type        : 'string',
									example     : 'witnesses',
								},
								facts                        : {
									description : '',
									type        : 'string',
									example     : 'facts',
								},
								workDescription              : {
									description : '',
									type        : 'string',
									example     : 'work description',
								},
								injury                       : {
									description : '',
									type        : 'boolean',
									example     : true,
								},
								sharpsExposure               : {
									description : '',
									type        : 'boolean',
									example     : true,
								},
								doctorNotified               : {
									description : '',
									type        : 'boolean',
									example     : true,
								},
								doctorAttended               : {
									description : '',
									type        : 'boolean',
									example     : true,
								},
								doctorName                   : {
									description : '',
									type        : 'string',
									example     : 'doctor name',
								},
								policeNotified               : {
									description : '',
									type        : 'boolean',
									example     : true,
								},
								policeAttended               : {
									description : '',
									type        : 'boolean',
									example     : true,
								},
								treatment                    : {
									description : '',
									type        : 'string',
									example     : 'treatment',
								},
								approvedDateTime             : {
									description : '',
									type        : 'date',
									example     : '2020-10-01T16:00:00.000Z',
								},
								approvedByEmployeeId         : {
									description : '',
									type        : 'integer',
									example     : 8,
								},
								officeComments               : {
									description : '',
									type        : 'string',
									example     : 'office comments',
								},
								injuryClaimSubmittedDateTime : {
									description : '',
									type        : 'date',
									example     : '2020-10-01T17:00:00.000Z',
								},
								injuryClaimApprovedDateTime  : {
									description : '',
									type        : 'date',
									example     : '2020-10-01T18:00:00.000Z',
								},
								injuryClaimRefNo             : {
									description : '',
									type        : 'string',
									example     : 'injury claim ref no',
								},
								injuryClaimComments          : {
									description : '',
									type        : 'string',
									example     : 'injury claim comments',
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
										example     : 'Incident updated successfully',
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
			summary     : 'Delete Incident',
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
					description : 'Incident Id',
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
										example     : 'Incident deleted successfully',
									},
									id      : {
										description : 'Unique ID for [Incidents] record',
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

module.exports = incidentSwagger;
