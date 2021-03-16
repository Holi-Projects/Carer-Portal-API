const sql = require('mssql');
const database = require('../services/database.js');

async function checkUserActive(email, userType) {
	console.log('Run: function checkUserActive(email, userType)');

	let type = 1;
	if (userType === 'carer') {
		type = 2;
	} else if (userType === 'client') {
		type = 3;
	}

	let sqlParams = [
		{ name: 'pEmail', type: sql.VarChar(50), value: email },
		{ name: 'pType', type: sql.SmallInt, value: type },
	];

	const result = await database.runStoredProcedure('spCheckLoginActive', sqlParams, []);
	//console.log('after calling runStoredProcedure()');
	//console.log(result);
	return result.recordset;
}
module.exports.checkUserActive = checkUserActive;

async function getUser(userId, userType) {
	console.log('Run: function getUser(userId, userType)');
	//Query the tables based on user type
	let tableName = 'Employees';
	if (userType === 'carer') {
		tableName = 'Carers';
	} else if (userType === 'client') {
		tableName = 'Clients';
	}

	let query = `SELECT
		[ID] AS id,
		[CompanyID] AS companyId,
		[First Name] AS firstName,
		[Last Name] AS lastName,
		[Mobile Phone] AS mobile,
		[E-mail Address] AS email,
		RTRIM([Password]) AS password,
		[PasswordSalt] AS passwordSalt,
		[Job Title] AS jobTitle,
		[Photo File Name] AS photo,
		'AUS Eastern Standard Time' AS timezone
		FROM ${tableName}
		WHERE [ID] = ${userId}`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.getUser = getUser;

async function getRoles(employeeId) {
	console.log('Run: function getRoles(employeeId)');

	let query = `SELECT R.RoleName AS name FROM [Employees Roles] ER JOIN [Roles] R on ER.RoleID = R.RoleID WHERE ER.EmpId = ${employeeId}`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.getRoles = getRoles;

async function changePassword(user, passwordSalt) {
	console.log('Run: function changePassword(user, password)');

	let tableName = 'Employees';
	if (user.userType === 'carer') {
		tableName = 'Carers';
	} else if (user.userType === 'client') {
		tableName = 'Clients';
	}

	// escape any single quotes that may be in the salt with an extra single quote to stop the query from getting confused
	const escapedSalt = passwordSalt.replace(/'/g, "''");
	const stmt = `UPDATE ${tableName} SET [PasswordSalt] = '${escapedSalt}' WHERE [ID] = ${user.userId} AND [CompanyID] = ${user.companyId}`;

	console.log(stmt);
	const result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}

module.exports.changePassword = changePassword;

async function saveResetToken(token, userType, userId) {
	console.log('Run: function saveResetToken(token, userType, userId)');

	const stmt = `INSERT INTO [Reset Password Tokens] ([Token], [Expiry], [UserType], [UserID]) VALUES ('${token}', DATEADD(HOUR,1,GETDATE()), '${userType}', ${userId})`;
	console.log(stmt);
	const result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}

module.exports.saveResetToken = saveResetToken;

async function findResetToken(token) {
	console.log('Run: function findResetToken(token)');

	const query = `SELECT 
				[UserType] AS userType, 
				[UserID] AS userId
				FROM [Reset Password Tokens]
				WHERE [Token] = '${token}'
				  AND [Expiry] > GETDATE()`;

	console.log(query);
	const result = await database.simpleExecute(query);
	console.log(result);
	return result.recordset;
}

module.exports.findResetToken = findResetToken;
