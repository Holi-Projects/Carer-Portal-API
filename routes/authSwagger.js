var authSwagger = {
	'/api/auth/signin'          : {
		post : {
			tags        : [ 'General' ],
			summary     : 'signin',
			description : `# User authentication using email and password.\n
			The user is authenticated against [Carers] or [Employee] tables based on user type and if successful, 
			key profile details are also retrieved from its table.
        	In addition, the Roles associated with an Employee user are sourced from their [Employee Roles] table.
        	The accessToken needs to be included on subsequent API calls using the 'x-access-token' header..\n
			Internals:\n
			The user type will determine the database table to query for example the carer table will 
			be queried if the user type is carer, with default set to query employees table. 
			If no record is found in the queried table login will fail with an alert message "User Not found.".
			If the request password does not match that on the database, the login will fail with an alert message 
			"Invalid Password!". 
			The accessToken contains an encrypted object with properties 'companyId','userType and 'id'. 
			On subsequent API calls these values are used to restrict access to only the data accessible to that user.
			`,
			requestBody : {
				required : true,
				content  : {
					'application/json' : {
						schema : {
							type       : 'object',
							properties : {
								email    : {
									description : 'email address of user signing in',
									type        : 'string',
									required    : 'true',
									example     : 'user@example.com',
								},
								password : {
									description : 'password of user signing in',
									type        : 'string',
									required    : 'true',
									example     : 'password',
								},
								userType : {
									description : 'type of user signing in',
									type        : 'string',
									enum        : [ 'carer', 'employee' ],
									example     : 'carer',
								},
							},
						},
					},
				},
			},
			responses   : {
				200 : {
					description : 'Authenticated',
					content     : {
						'application/json' : {
							schema : {
								type  : 'array',
								items : {
									type       : 'object',
									properties : {
										id          : {
											description : '',
											type        : 'integer',
											example     : '1',
										},
										firstName   : {
											description : '',
											type        : 'string',
											example     : 'John',
										},
										lastName    : {
											description : '',
											type        : 'string',
											example     : 'Smith',
										},
										mobile      : {
											description : '',
											type        : 'string',
											example     : '0400123456',
										},
										email       : {
											description : '',
											type        : 'string',
											example     : 'john.smith@example.com',
										},
										jobTitle    : {
											description : '',
											type        : 'string',
											example     : 'Manager',
										},
										photo       : {
											description : '',
											type        : 'string',
											example     : '/images/employees/john.jpg',
										},
										roles       : {
											description : '',
											type        : 'array',
											items       : {
												type    : 'string',
												example : 'ROLE_ADMINISTRATOR',
											},
											//example     : `[ 'ROLE_ADMINISTRATOR', 'ROLE_SCHEDULE', ... ]`,
										},
										accessToken : {
											description : '',
											type        : 'string',
											example     : 'yJhbGciOiJIUz...',
										},
									},
								},
							},
						},
					},
				},
				401 : {
					description : 'Unautorized',
					content     : {
						'application/json' : {
							schema : {
								$ref : '#/components/schemas/error',
							},
						},
					},
				},
				404 : {
					description : 'Not Found',
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
	'/api/auth/change-password' : {
		put : {
			tags        : [ 'General' ],
			summary     : 'change password',
			description : `# Change password.\n
			Allows the signed in user to change their password.
			Both the existing password and the new password need to be sent in the body to guard against the password being changed from an unattended screen.
			The new password cannot be the same as the old password.
			The new password must contain a lower case character, an upper case character, a digit, a special character and have a minimun length of 8.
			`,
			requestBody : {
				required : true,
				content  : {
					'application/json' : {
						schema : {
							type       : 'object',
							properties : {
								oldPassword : {
									description : 'existing password',
									type        : 'string',
									required    : 'true',
									example     : 'password',
								},
								newPassword : {
									description : 'new password',
									type        : 'string',
									required    : 'true',
									example     : 'new_password',
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
										example     : 'true',
									},
									message : {
										description : '',
										type        : 'string',
										example     : 'Password updated successfully',
									},
								},
							},
						},
					},
				},
				401 : {
					description : 'Unautorized',
					content     : {
						'application/json' : {
							schema : {
								$ref : '#/components/schemas/error',
							},
						},
					},
				},
				404 : {
					description : 'Not Found',
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

module.exports = authSwagger;
