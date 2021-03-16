const dateTimeUtil = require('./dateTimeUtil');

function mapDataForInsert(formData, dbFields, primaryKey, companyTimezone) {
	console.log('mapDataForInsert');

	let fieldList = [];
	let valueList = [];
	console.log(primaryKey);

	for (let [ key, value ] of Object.entries(formData)) {
		let fieldName = dbFields.dataFields[key]; // Other fields apart from date/time
		let dateTimeField = dbFields.dateTimeFields[key];
		let timeField = dbFields.timeFields[key];
		console.log(fieldName + '---' + primaryKey + '----' + value);

		if (fieldName !== primaryKey) {
			if (fieldName !== undefined) {
				if (typeof value === 'string') value = `'${value}'`; // strings need to be single quoted in SQL
				if (typeof value === 'boolean') value = value ? 1 : 0; // booleans need to be translated from true/false to 1/0 in SQL
				if (value !== null) {
					fieldList.push(fieldName);
					valueList.push(value);
				}
			}

			if (dateTimeField !== undefined) {
				let value2db = value !== null ? `'${value}'` : null;
				value = dateTimeUtil.utcDate2dbDate(value2db, companyTimezone);
				if (value2db !== null) {
					fieldList.push(dateTimeField);
					valueList.push(value);
				}
			}

			if (timeField !== undefined) {
				let value2db = value !== null ? `'${value}'` : null;
				value = dateTimeUtil.utcDate2dbTime(value2db, companyTimezone);
				if (value2db !== null) {
					fieldList.push(timeField);
					valueList.push(value);
				}
			}
		}
	}

	return [ fieldList, valueList ];
}
module.exports.mapDataForInsert = mapDataForInsert;

function mapForInsert(user, dbModel, data) {
	return mapDataForInsert(data, dbModel, dbModel.primaryKey, user.companyTimezone);
}
module.exports.mapForInsert = mapForInsert;

function mapDataForUpdate(formData, dbFields, primaryKey, companyTimezone) {
	console.log('mapDataForUpdate');
	// console.log(formData)
	// console.log(dbFields)
	// console.log(primaryKey)
	let keyValueList = [];
	for (let [ key, value ] of Object.entries(formData)) {
		let fieldName = dbFields.dataFields[key]; // Other fields apart from date/time
		let dateTimeField = dbFields.dateTimeFields[key];
		let timeField = dbFields.timeFields[key];
		if (fieldName !== primaryKey) {
			if (fieldName !== undefined) {
				if (typeof value === 'string') value = `'${value}'`; // strings need to single quoted in SQL
				if (typeof value === 'boolean') value = value ? 1 : 0; // booleans need to be translated from true/false to 1/0 in SQL
				//if (value !== null) {
				keyValueList.push(`${fieldName}=${value}`);
				//}
			}

			if (dateTimeField !== undefined) {
				//let value2db = value !== null ? `'${value}'` : null;
				//value = dateTimeUtil.utcDate2dbDate(value2db, companyTimezone);
				//if (value2db !== null) {
				//	keyValueList.push(`${dateTimeField}=${value}`);
				//}
				if (value !== null) value = dateTimeUtil.utcDate2dbDate(`'${value}'`, companyTimezone);
				keyValueList.push(`${dateTimeField}=${value}`);
			}

			if (timeField !== undefined) {
				//let value2db = value !== null ? `'${value}'` : null;
				//value = dateTimeUtil.utcDate2dbTime(value2db, companyTimezone);
				//if (value2db !== null) {
				//	keyValueList.push(`${dateTimeField}=${value}`);
				//}
				if (value !== null) value = dateTimeUtil.utcDate2dbTime(`'${value}'`, companyTimezone);
				keyValueList.push(`${timeField}=${value}`);
			}
		}
	}

	return keyValueList;
}
module.exports.mapDataForUpdate = mapDataForUpdate;

function mapForUpdate(user, dbModel, data) {
	return mapDataForUpdate(data, dbModel, dbModel.primaryKey, user.companyTimezone);
}
module.exports.mapForUpdate = mapForUpdate;

function quote(str) {
	let s = str.replace(/'/g, "''"); // first escape single quotes with another single quote
	return `'${s}'`; // put single quotes around the whole thing.
}

/*function mapData(data, dbFieldMap, timezone, dateFields, timeFields) {
	console.log('data');

	const fields = [];
	const values = [];
	for (let [ key, value ] of Object.entries(data)) {
		if (key !== 'id') {
			const dbFieldName = dbFieldMap[key];

			if (dbFieldName !== undefined) {
				fields.push(dbFieldName);

				if (typeof value === 'string') value = quote(value); // strings need to single quoted in SQL
				if (typeof value === 'boolean') value = value ? 1 : 0; // booleans need to be translated from true/false to 1/0 in SQL
				if (dateFields.includes(dbFieldName)) value = dateTimeUtil.utcDate2dbDate(value, timezone);
				if (timeFields.includes(dbFieldName)) value = dateTimeUtil.utcDate2dbTime(value, timezone);
				if (value === null) value = 'NULL';
				values.push(value);
			}
		}
	}
	return { fields, values };
}

function mapDataForInsert2(data, dbFieldMap, timezone = '', dateFields = [], timeFields = []) {
	console.log('data');

	const { fields, values } = mapData(data, dbFieldMap, timezone, dateFields, timeFields);
	return { fieldList: fields.join(), valueList: values.join() };
}
module.exports.mapDataForInsert2 = mapDataForInsert2;

function mapDataForUpdate2(data, dbFieldMap, timezone = '', dateFields = [], timeFields = []) {
	console.log('data');

	const { fields, values } = mapData(data, dbFieldMap, timezone, dateFields, timeFields);
	const fieldValueList = [];
	for (i = 0; i < fields.length; i++) {
		fieldValueList.push(`${fields[i]} = ${values[i]}`);
	}
	return fieldValueList.join();
}
module.exports.mapDataForUpdate2 = mapDataForUpdate2;*/

function mapDataForSelect(tableAlias, dbFields, primaryKey, companyTimezone) {
	let fieldList = [];
	if (dbFields.dataFields !== undefined)
		for (let [ key, value ] of Object.entries(dbFields.dataFields)) {
			if (key !== 'companyId') {
				// companyId does not need to be exposed to front end
				if (value !== primaryKey) {
					fieldList.push([ tableAlias, value ].join('.') + ' AS ' + key);
				} else {
					fieldList.push([ tableAlias, value ].join('.') + ' AS id');
				}
			}
		}

	if (dbFields.dateTimeFields !== undefined)
		for (let [ key, value ] of Object.entries(dbFields.dateTimeFields)) {
			fieldList.push(
				dateTimeUtil.dbDate2utcDate([ tableAlias, value ].join('.'), companyTimezone) + ' AS ' + key
			);
		}

	if (dbFields.timeFields !== undefined)
		for (let [ key, value ] of Object.entries(dbFields.timeFields)) {
			fieldList.push(
				dateTimeUtil.dbTime2utcDate([ tableAlias, value ].join('.'), companyTimezone) + ' AS ' + key
			);
		}

	return fieldList;
}
module.exports.mapDataForSelect = mapDataForSelect;

function mapForSelect(user, dbModel, tableAlias) {
	return mapDataForSelect(tableAlias, dbModel, dbModel.primaryKey, user.companyTimezone);
}
module.exports.mapForSelect = mapForSelect;

function listSqlStatement(user, dbModel, tableAlias = 'A') {
	// const fieldList = mapDataForSelect(tableAlias, dbModel, dbModel.primaryKey, user.companyTimezone);
	const fieldList = mapForSelect(user, dbModel, tableAlias);

	let statement = `SELECT ${fieldList} FROM ${dbModel.tableName} ${tableAlias} `;
	if (Object.keys(dbModel.dataFields).includes('companyId'))
		statement += `WHERE ${dbModel.dataFields.companyId} = ${user.companyId} `;
	else statement += 'WHERE 1=1 ';

	return statement;
}
module.exports.listSqlStatement = listSqlStatement;

function getSqlStatement(user, dbModel, id, tableAlias = 'A') {
	let statement = listSqlStatement(user, dbModel, tableAlias);
	statement += `AND ${tableAlias}.${dbModel.primaryKey} = ${id} `;

	return statement;
}
module.exports.getSqlStatement = getSqlStatement;

// updateSqlStatement()
function updateSqlStatement(user, dbModel, id, data) {
	const keyValueList = mapForUpdate(user, dbModel, data);

	let statement = `UPDATE ${dbModel.tableName} SET ${keyValueList} WHERE ${dbModel.primaryKey} = ${id} `;

	if (Object.keys(dbModel.dataFields).includes('companyId'))
		statement += `AND ${dbModel.dataFields.companyId} = ${user.companyId}`;

	return statement;
}
module.exports.updateSqlStatement = updateSqlStatement;

// insertSqlStatement()
function insertSqlStatement(user, dbModel, data) {
	let [ fieldList, valueList ] = mapForInsert(user, dbModel, data);
	// console.log('insertSqlStatement()');
	// console.log(fieldList);
	// console.log(valueList);

	if (Object.keys(dbModel.dataFields).includes('companyId')) {
		fieldList = `${dbModel.dataFields.companyId},${fieldList}`;
		valueList = `${user.companyId},${valueList}`;
	}

	const statement = `INSERT INTO ${dbModel.tableName} (${fieldList}) OUTPUT INSERTED.${dbModel.primaryKey} AS id VALUES (${valueList});`;

	return statement;
}
module.exports.insertSqlStatement = insertSqlStatement;

// removeSqlStatement()
function removeSqlStatement(user, dbModel, id) {
	let statement = `DELETE FROM ${dbModel.tableName} OUTPUT DELETED.${dbModel.primaryKey} AS id
						WHERE ${dbModel.primaryKey} = ${id} `;

	if (Object.keys(dbModel.dataFields).includes('companyId'))
		statement += `AND ${dbModel.dataFields.companyId} = ${user.companyId}`;

	return statement;
}
module.exports.removeSqlStatement = removeSqlStatement;

function mapDataForSelectSingleTable(tableAlias, dbFields, primaryKey, companyTimezone) {
	let fieldList = [];
	if (dbFields.dataFields !== undefined)
		for (let [ key, value ] of Object.entries(dbFields.dataFields)) {
			if (value !== primaryKey.id) {
				fieldList.push([ tableAlias, value ].join('.') + ' AS ' + key + '\n');
			}

			if (value === primaryKey.id && primaryKey.forSelect) {
				fieldList.push([ tableAlias, value ].join('.') + ' AS id\n');
			}
		}

	if (dbFields.dateTimeFields !== undefined)
		for (let [ key, value ] of Object.entries(dbFields.dateTimeFields)) {
			fieldList.push(
				dateTimeUtil.dbDate2utcDate([ tableAlias, value ].join('.'), companyTimezone) + ' AS ' + key + '\n'
			);
		}

	if (dbFields.timeFields !== undefined)
		for (let [ key, value ] of Object.entries(dbFields.timeFields)) {
			fieldList.push(
				dateTimeUtil.dbTime2utcDate([ tableAlias, value ].join('.'), companyTimezone) + ' AS ' + key + '\n'
			);
		}

	return fieldList;
}
module.exports.mapDataForSelectSingleTable = mapDataForSelectSingleTable;

// function mapDataForInsertSingleTable(formData, dbFields, primaryKey, companyTimezone) {
// 	let fieldList = [];
// 	let valueList = [];
// 	for (let [ key, value ] of Object.entries(formData)) {
// 		let fieldName = dbFields.dataFields[key]; // Other fields apart from date/time
// 		let dateTimeField = dbFields.dateTimeFields[key];
// 		let timeField = dbFields.timeFields[key];

// 		if (key !== primaryKey) {
// 			if (fieldName !== undefined) {
// 				if (typeof value === 'string') value = `'${value}'`; // strings need to single quoted in SQL
// 				if (typeof value === 'boolean') value = value ? 1 : 0; // booleans need to be translated from true/false to 1/0 in SQL
// 				if (value !== null) {
// 					fieldList.push(fieldName);
// 					valueList.push(value);
// 				}
// 			}

// 			if (dateTimeField !== undefined) {
// 				let value2db = value !== null ? `'${value}'` : null;
// 				value = dateTimeUtil.utcDate2dbDate(value2db, companyTimezone);
// 				if (value2db !== null) {
// 					fieldList.push(dateTimeField);
// 					valueList.push(value);
// 				}
// 			}

// 			if (timeField !== undefined) {
// 				let value2db = value !== null ? `'${value}'` : null;
// 				value = dateTimeUtil.utcDate2dbTime(value2db, companyTimezone);
// 				if (value2db !== null) {
// 					fieldList.push(timeField);
// 					valueList.push(value);
// 				}
// 			}
// 		}
// 	}

// 	return [ fieldList, valueList ];
// }
// module.exports.mapDataForInsertSingleTable = mapDataForInsertSingleTable;

function mapDataForSelectMultipleTables(dbModel, companyTimezone) {
	let fieldList = [];
	for (let [ key, value ] of Object.entries(dbModel.dbFields)) {
		fieldList.push(
			mapDataForSelectSingleTable(dbModel.tableAliases[key], value, dbModel.primaryKeys[key], companyTimezone)
		);
	}
	return fieldList;
}
module.exports.mapDataForSelectMultipleTables = mapDataForSelectMultipleTables;

function mapDataForUpdateMultipleTables(data, dbModel, companyTimezone) {
	console.log('mapDataForUpdateMultipleTables');

	let keyValueList = {};
	// console.log(dbModel)
	for (let [ key, value ] of Object.entries(data)) {
		if (!isEmptyObj(value.data)) {
			keyValueList[key] = mapDataForUpdate(
				value.data,
				dbModel.dbFields[key],
				dbModel.primaryKeys[key].id,
				companyTimezone
			);
		}
	}

	return keyValueList;
}
module.exports.mapDataForUpdateMultipleTables = mapDataForUpdateMultipleTables;

function isEmptyObj(obj) {
	return Object.keys(obj).length === 0;
}
