const database = require('../services/database.js');
const {
	getSqlStatement,
	updateSqlStatement,
	insertSqlStatement,
	removeSqlStatement,
	listSqlStatement,
} = require('../utils/mapUtils.js');
const { dbModel } = require('../db_model/refSkill.js');

const dbField = {
	id            : '[SkillNo]',
	companyId     : '[CompanyID]',
	name          : '[Skill Name]',
	description   : '[Skill Description]',
	hasExpiryDate : '[Has Expiry Date]',
};

// Get Skill reference data on a GET HTTP request
async function getList(user) {
	console.log('DB:refSkill.getList(user) ');

	let query = `SELECT 
			[SkillNo] AS id, 
			[Skill Name] AS name, 
			[Skill Description] AS description, 
			[Has Expiry Date] as hasExpiryDate
		FROM [Skills]
		WHERE CompanyID = ${user.companyId}
		ORDER BY [Skill Name]`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getList = getList;

// list()
async function list(user) {
	console.log('DB:refSkill.list(user) ');

	let query = listSqlStatement(user, dbModel);
	query += 'ORDER BY [Skill Name]';

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.list = list;

async function get(user, id) {
	console.log('DB:refSkill.get(user, id) ');
	console.log(`id: ${id}`);

	// const query = `SELECT
	// 		[SkillNo] AS id,
	// 		[Skill Name] AS name,
	// 		[Skill Description] AS description,
	// 		[Has Expiry Date] as hasExpiryDate
	// 	FROM [Skills]
	// 	WHERE CompanyID = ${user.companyId}
	// 	ORDER BY [Skill Name]
	// 	  AND [SkillNo] = ${id}`;

	let query = getSqlStatement(user, dbModel, id);
	console.log(query);

	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.get = get;

async function update(user, id, data) {
	console.log('DB:refSkill.update(user, id, data)');

	// let fields = [];
	// for (let [ key, value ] of Object.entries(data)) {
	// 	console.log(key, value);

	// 	const dbFieldName = dbField[key];
	// 	if (dbFieldName && dbFieldName !== '[SkillNo]') {
	// 		if (typeof value === 'string') value = `'${value}'`; // strings need to single quoted in SQL
	// 		if (typeof value === 'boolean') value = value ? 1 : 0; // booleans need to be translated from true/false to 1/0 in SQL

	// 		fields.push(`${dbFieldName}=${value}`);
	// 	}
	// }
	// const fieldList = fields.join();

	// const query = `UPDATE [Skills]
	//                     SET ${fieldList}
	// 				 WHERE [CompanyID] = ${user.companyId}
	// 				   AND [SkillNo] = ${id}`;

	// console.log(query);
	// const result = await database.simpleExecute(query);

	const statement = updateSqlStatement(user, dbModel, id, data);
	console.log(statement);
	const result = await database.simpleExecute(statement);

	console.log(result);
	return result;
}
module.exports.update = update;

async function insert(user, data) {
	console.log('DB:refSkill.insert(user, data)');

	const res = { success: false };

	// Check mandatory fields
	if (data.name === undefined) {
		res.message = 'Name is mandatory';
		return res;
	}
	/*if (data.hasExpiryDate === undefined) {
		res.message = 'Has Expiry Date is mandatory';
		return res;
	}*/

	// Duplicate Detection
	// const query = `SELECT
	// 		[SkillNo] AS id,
	// 		[Skill Name] AS name,
	// 		[Skill Description] AS description,
	// 		[Has Expiry Date] as hasExpiryDate
	// 	FROM [Skills]
	// 	WHERE CompanyID = ${user.companyId}
	// 	  AND [Skill Name] = '${data.name}'`;

	let query = listSqlStatement(user, dbModel);
	query += `AND [Skill Name] = '${data.name}'`;
	console.log(query);

	let result = await database.simpleExecute(query);
	if (result.recordset.length > 0) {
		res.message = 'Duplicate(s) detected';
		//res.id = result.recordset[0].id;
		res.duplicates = result.recordset;
		return res;
	}

	// Insert
	// let fields = [ '[CompanyID]' ];
	// let values = [ user.companyId ];
	// for (let [ key, value ] of Object.entries(data)) {
	// 	console.log(key, value);

	// 	const dbFieldName = dbField[key];
	// 	if (value && dbFieldName && dbFieldName !== '[SkillNo]') {
	// 		if (typeof value === 'string') value = `'${value}'`; // strings need to single quoted in SQL
	// 		if (typeof value === 'boolean') value = value ? 1 : 0; // booleans need to be translated from true/false to 1/0 in SQL

	// 		fields.push(dbFieldName);
	// 		values.push(value);
	// 	}
	// }
	// const fieldList = fields.join();
	// const valueList = values.join();

	// const stmt = `INSERT INTO [Skills] (${fieldList}) OUTPUT INSERTED.[SkillNo] AS id VALUES (${valueList});`;
	// console.log(stmt);
	// result = await database.simpleExecute(stmt);

	const statement = insertSqlStatement(user, dbModel, data);
	console.log(statement);
	result = await database.simpleExecute(statement);
	console.log(result);

	if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
		res.success = true;
		res.message = 'Skill inserted successfully';
		res.id = result.recordset[0].id;
		return res;
	}

	res.message = 'Insert failed';
	return res;
}
module.exports.insert = insert;

async function remove(user, id) {
	console.log('DB:refSkill.remove(user, id)');

	const statement = removeSqlStatement(user, dbModel, id);
	console.log(statement);
	const result = await database.simpleExecute(statement);

	// let query = `DELETE FROM [Skills]
	//     OUTPUT DELETED.[SkillNo] AS id
	//     WHERE [CompanyID] = ${user.companyId}
	//       AND [SkillNo] = ${id}`;

	// console.log(query);
	// const result = await database.simpleExecute(query);
	console.log(result);
	return result;
}
module.exports.remove = remove;
