const database = require('../services/database.js');

const dbField = {
	id        : '[RefNo]',
	companyId : '[CompanyID]',
	type      : '[RefType]',
	name      : '[RefName]',
	code      : '[RefCode]',
};

// Get PostCode reference data on a GET HTTP request
async function getRefType(user, typeName) {
	console.log('Run: function getRefType(typeName) ');

	if (typeName === 'sub-issue') {
		typeName = 'issuesub';
	} else if (typeName === 'med-admin') {
		typeName = 'medadmin';
	} else if (typeName === 'med-store') {
		typeName = 'medstore';
	} else if (typeName === 'med-support') {
		typeName = 'medsupport';
	} else if (typeName === 'contact-type') {
		typeName = 'contact';
	}

	query =
		'SELECT RefNo AS id, RTRIM(RefType) AS type, RTRIM(RefName) AS name, RTRIM(RefCode) AS code ' +
		'FROM [Ref Types] ' +
		`WHERE [CompanyID] = ${user.companyId} `;

	if (typeName) {
		query += `AND LOWER(RTRIM(RefType)) = '${typeName}' `;
	}

	query += 'ORDER BY name';

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getRefType = getRefType;

async function getList(user) {
	console.log('DB:refType.getList(user)');

	const query = `SELECT 
			RefNo AS id,
			RTRIM(RefType) AS type,
			RTRIM(RefName) AS name,
			RTRIM(RefCode) AS code
			FROM [Ref Types]
		WHERE [CompanyID] = ${user.companyId}`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getList = getList;

async function get(user, id) {
	console.log('DB:refType.get(user, id)');
	console.log(`id: ${id}`);

	const query = `SELECT 
			RefNo AS id,
			RTRIM(RefType) AS type,
			RTRIM(RefName) AS name,
			RTRIM(RefCode) AS code
			FROM [Ref Types]
		WHERE [CompanyID] = ${user.companyId}
		  AND [RefNo] = ${id}`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.get = get;

async function update(user, id, data) {
	console.log('DB:refType.update(user, id, data)');

	let fields = [];
	for (let [ key, value ] of Object.entries(data)) {
		console.log(key, value);

		const dbFieldName = dbField[key];
		if (dbFieldName && dbFieldName !== '[RefNo]') {
			if (typeof value === 'string') value = `'${value}'`; // strings need to single quoted in SQL

			fields.push(`${dbFieldName}=${value}`);
		}
	}
	const fieldList = fields.join();

	const query = `UPDATE [Ref Types] 
                        SET ${fieldList}
					 WHERE [CompanyID] = ${user.companyId} 
					   AND [RefNo] = ${id}`;

	console.log(query);

	const result = await database.simpleExecute(query);
	console.log(result);
	return result;
}
module.exports.update = update;

async function insert(user, data) {
	console.log('DB:refType.insert(user, data)');

	const res = { success: false };

	// Check mandatory fields
	if (data.type === undefined) {
		res.message = 'Type is mandatory';
		return res;
	}
	if (data.name === undefined) {
		res.message = 'Name is mandatory';
		return res;
	}

	// Duplicate Detection
	const query = `SELECT
		RefNo AS id,
			RTRIM(RefType) AS type,
			RTRIM(RefName) AS name,
			RTRIM(RefCode) AS code
			FROM [Ref Types]
		WHERE [CompanyID] = ${user.companyId}
		  AND [RefType] = '${data.type}'
		  AND [RefName] = '${data.name}'`;

	console.log(query);
	let result = await database.simpleExecute(query);
	if (result.recordset.length > 0) {
		res.message = 'Duplicate(s) detected';
		//res.id = result.recordset[0].id;
		res.duplicates = result.recordset;
		return res;
	}

	// Insert
	let fields = [ '[CompanyID]' ];
	let values = [ user.companyId ];
	for (let [ key, value ] of Object.entries(data)) {
		console.log(key, value);

		const dbFieldName = dbField[key];
		if (value && dbFieldName && dbFieldName !== '[RefNo]') {
			if (typeof value === 'string') value = `'${value}'`; // strings need to single quoted in SQL

			fields.push(dbFieldName);
			values.push(value);
		}
	}
	const fieldList = fields.join();
	const valueList = values.join();

	const stmt = `INSERT INTO [Ref Types] (${fieldList}) OUTPUT INSERTED.[RefNo] AS id VALUES (${valueList});`;

	console.log(stmt);
	result = await database.simpleExecute(stmt);
	console.log(result);

	if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
		res.success = true;
		res.message = 'Ref Type inserted successfully';
		res.id = result.recordset[0].id;
		return res;
	}

	res.message = 'Insert failed';
	return res;
}
module.exports.insert = insert;

async function remove(user, id) {
	console.log('DB:refType.remove(user, id)');

	let query = `DELETE FROM [Ref Types] 
        OUTPUT DELETED.[RefNo] AS id 
        WHERE [CompanyID] = ${user.companyId}
          AND [RefNo] = ${id}`;

	console.log(query);
	const result = await database.simpleExecute(query);
	console.log(result);
	return result;
}
module.exports.remove = remove;
