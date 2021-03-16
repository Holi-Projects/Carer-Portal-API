const database = require('../../services/database.js');
//const { mapDataForSelect, mapDataForInsert, mapDataForUpdate } = require('../../utils/mapUtils');
//const { dbModel } = require('../../db_model/hcp/clientBudget.js');

/*async function list(user, queryParams) {
	console.log('DB:clientBudget.js.list(user, queryParams)');
	let query = ``;
	let fieldList = mapDataForSelect('A', dbModel, dbModel.primaryKey, user.companyTimezone);

	query = `SELECT 
                ${fieldList}
            FROM ${dbModel.tableName} A
            JOIN [Clients] B ON B.[ID] = A.[ClientID]`;

	let where = `WHERE B.[CompanyID] = ${user.companyId} `;

	if (queryParams.clientId) {
		where += `AND A.[ClientID] =  ${queryParams.clientId} `;
	}

	query += where;

	query += `ORDER BY B.[Last Name], B.[First Name]`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.list = list;

async function get(user, id) {
	console.log('DB:clientBudget.js.get(user, id)');
	console.log(`id: ${id}`);

	let query = ``;
	if (id !== undefined) {
		let fieldList = mapDataForSelect('A', dbModel, dbModel.primaryKey, user.companyTimezone);

		query = `SELECT ${fieldList} FROM ${dbModel.tableName} A
                    WHERE A.${dbModel.primaryKey} = ${id}`;
	}

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.get = get;*/

async function update(user, id, data) {
	console.log('DB:clientBudget.js.update(user, id, data)');

	//let keyValueList = mapDataForUpdate(data, dbModel, dbModel.primaryKey, user.companyTimezone);

	//const stmt = `UPDATE ${dbModel.tableName} SET ${keyValueList}
	//                WHERE ${dbModel.primaryKey} = ${id}`;
	let stmt = database.startTransaction;

	stmt += `UPDATE [ClientInitialBalance] SET 
            [ClientPortion] = ${data.initialBalance.client}, 
            [GovPortion] = ${data.initialBalance.government}, 
            [Amount] = ${data.initialBalance.client} + ${data.initialBalance.government}
            WHERE [ClientID] = ${id};`;

	stmt += `UPDATE [ClientInitialFunding] SET
            [ReceivedAmount] = ${data.initialFunding.government.received},
            [NotReceivedAmount] = ${data.initialFunding.government.notReceived},
            [Amount] = ${data.initialFunding.government.received} + ${data.initialFunding.government.notReceived}
            WHERE [ClientID] = ${id}
              AND [InboundID] = 1;`;

	stmt += `UPDATE [ClientInitialFunding] SET
            [ReceivedAmount] = ${data.initialFunding.client.received},
            [NotReceivedAmount] = ${data.initialFunding.client.notReceived},
            [Amount] = ${data.initialFunding.client.received} + ${data.initialFunding.client.notReceived}
            WHERE [ClientID] = ${id}
              AND [InboundID] = 2;`;

	stmt += `UPDATE [ClientInitialExpenditure] SET
            [Amount] = ${data.initialExpenditure.services}
            WHERE [ClientID] = ${id}
              AND [OutboundID] = 1;`;

	stmt += `UPDATE [ClientInitialExpenditure] SET
            [Amount] = ${data.initialExpenditure.administration}
            WHERE [ClientID] = ${id}
              AND [OutboundID] = 2;`;

	stmt += `UPDATE [ClientInitialExpenditure] SET
            [Amount] = ${data.initialExpenditure.advisory}
            WHERE [ClientID] = ${id}
              AND [OutboundID] = 3;`;

	stmt += database.endTransaction;

	console.log(stmt);
	const result = await database.simpleExecute(stmt);
	//console.log(result);
	return result;
}
module.exports.update = update;

/*async function insert(user, data) {
	console.log('DB:clientBudget.js.insert(user, data)');
	let [ fieldList, valueList ] = mapDataForInsert(data, dbModel, dbModel.primaryKey, user.companyTimezone);
	//console.log(fieldList)
	const stmt = `INSERT INTO ${dbModel.tableName} (${fieldList}) OUTPUT INSERTED.${dbModel.primaryKey} AS id VALUES (${valueList});`;

	console.log(stmt);
	result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}
module.exports.insert = insert;

async function remove(user, id) {
	console.log('DB:clientBudget.js.remove(user, id)');

	const stmt = `DELETE FROM ${dbModel.tableName} OUTPUT DELETED.${dbModel.primaryKey} AS id 
                    WHERE ${dbModel.primaryKey} = ${id}`;

	console.log(stmt);
	const result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}
module.exports.remove = remove;*/
