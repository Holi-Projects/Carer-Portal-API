const database = require('../../services/database.js');
const { mapDataForSelect, mapDataForInsert, mapDataForUpdate } = require('../../utils/mapUtils');
const { dbModel } = require('../../db_model/hcp/inboundTransaction.js');

async function list(user, queryParams) {
	console.log('DB:inboundTransaction.list(user, queryParams)');
	let query = ``;
	let fieldList = mapDataForSelect('A', dbModel, dbModel.primaryKey, user.companyTimezone);

	query = `SELECT 
                ${fieldList},
                B.[First Name] + ' ' + B.[Last Name] AS clientName,
                CASE 
					WHEN A.[ExpectedAmount] = 0 THEN 'N/A'
					WHEN A.[ExpectedAmount] = A.[ReceivedAmount] THEN 'Received'
                    WHEN A.[ReceivedAmount] > 0 AND A.[ExpectedAmount] > A.[ReceivedAmount] THEN 'Partially Received' 
                    ELSE 'Pending'
                END AS status

            FROM ${dbModel.tableName} A
            JOIN [Clients] B ON B.[ID] = A.[ClientID] `;

	let where = `WHERE B.[CompanyID] = ${user.companyId} `;

	console.log(queryParams);
	if (queryParams.year && queryParams.month) {
		where += `AND A.[Year] = ${queryParams.year} AND A.[Month] = ${queryParams.month} `;
	}
	if (queryParams.clientId) {
		where += `AND A.ClientID = ${queryParams.clientId} `;
	}

	query += where;

	query += `ORDER BY [timestamp] DESC`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.list = list;

async function get(user, id) {
	console.log('DB:inboundTransaction.get(user, id)');
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
module.exports.get = get;

async function update(user, id, data) {
	console.log('DB:inboundTransaction.update(user, id, data)');
	//console.log(data);

	//  Start transaction
	let stmt = database.startTransaction;

	let keyValueList = mapDataForUpdate(data, dbModel, dbModel.primaryKey, user.companyTimezone);

	stmt += `UPDATE ${dbModel.tableName} SET ${keyValueList}
            WHERE ${dbModel.primaryKey} = ${id};\n`;

	if (data.expectedAmount !== undefined || data.receivedAmount !== undefined) {
		// recalculate the balance
		stmt += `UPDATE ${dbModel.tableName} 
				SET [Balance] = (SELECT [ExpectedAmount] - [ReceivedAmount] FROM ${dbModel.tableName} WHERE ${dbModel.primaryKey} = ${id})
				WHERE ${dbModel.primaryKey} = ${id};\n`;
	}

	// Commit the transaction
	stmt += database.endTransaction;

	console.log(stmt);
	const result = await database.simpleExecute(stmt);
	//console.log(result);
	return result;
}
module.exports.update = update;

async function insert(user, data) {
	console.log('DB:inboundTransaction.insert(user, data)');
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
	console.log('DB:inboundTransaction.remove(user, id)');

	const stmt = `DELETE FROM ${dbModel.tableName} OUTPUT DELETED.${dbModel.primaryKey} AS id 
                    WHERE ${dbModel.primaryKey} = ${id}`;

	console.log(stmt);
	const result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}
module.exports.remove = remove;

// Compile a monthly summary for the ClientMonthlyStatement table.
async function getReceivedAmounts(user, clientId, year, month) {
	console.log('DB:inboundTransaction.getReceivedAmounts(user, clientId, year, month)');

	const query = `SELECT
					A.[ClientId] AS clientId,
					A.[Month] AS month,
					A.[Year] AS year,
					A.[InboundID] AS inboundTypeId,
					SUM(A.[ReceivedAmount]) AS receivedAmount
					FROM ${dbModel.tableName} A
					JOIN Clients B ON B.[ID] = A.[ClientID]
					WHERE B.[CompanyID] = ${user.companyId}
					AND A.[Year] = ${year}
					AND A.[Month] = ${month}
					AND A.[ClientID] = ${clientId}
					GROUP BY A.[ClientID], A.[Month], A.[Year], A.[InboundID]`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getReceivedAmounts = getReceivedAmounts;

async function insertBlock(user, clientId, year, month) {
	console.log('DB:inboundTransaction.insertBlock(user, clientId, year, month)');

	// Check if records already exist for this client and month, and if so re-calculate the ExpectedAmount and Balance.
	let transactionId1 = 0;
	let transactionId2 = 0;
	let transactionId3 = 0;
	let receivedGovernmentSubsidy = 0;
	let receivedIncomeTestedFee = 0;
	let receivedSuppSubsidy = 0;

	const fieldList = mapDataForSelect('A', dbModel, dbModel.primaryKey, user.companyTimezone);

	query = `SELECT ${fieldList} FROM ${dbModel.tableName} A
				WHERE A.[ClientID] = ${clientId}
				  AND A.[Year] = ${year}
				  AND A.[Month] = ${month}`;

	console.log(query);
	const queryResult = await database.simpleExecute(query);
	if (queryResult.recordset.length > 0) {
		queryResult.recordset.forEach((rec) => {
			console.log(rec);
			if (rec.inboundTypeId === 1) {
				transactionId1 = rec.id;
				receivedGovernmentSubsidy = rec.receivedAmount;
			}
			if (rec.inboundTypeId === 2) {
				transactionId2 = rec.id;
				receivedIncomeTestedFee = rec.receivedAmount;
			}
			if (rec.inboundTypeId === 3) {
				transactionId3 = rec.id;
				receivedSuppSubsidy = rec.receivedAmount;
			}
		});
	}

	//  Start transaction
	let stmt = database.startTransaction;

	stmt += `DECLARE @govSubsidy DECIMAL(18,2) = 0.00
			 DECLARE @clientContribution DECIMAL(18,2) = 0.00
			 DECLARE @suppSubsidy DECIMAL(18,2) = 0.00
			 
			 SET @govSubsidy = (SELECT SUM([HCPAmount])
			 FROM [ClientDailyStatementData]
			 WHERE [ClientID] = ${clientId}
			 AND MONTH([Date]) = ${month}
			 AND YEAR([Date]) = ${year})
 
 			 SET @clientContribution = (SELECT ROUND(SUM([IncomeTestedFee]),2) + ROUND(SUM([BasicDailyFee]),2)
			 FROM [ClientDailyStatementData]
			 WHERE [ClientID] = ${clientId}
			 AND MONTH([Date]) = ${month}
			 AND YEAR([Date]) = ${year})

			 SET @suppSubsidy = (SELECT sum([SuppAmount])
			 FROM [ClientDailyStatementData]
			 WHERE [ClientID] = ${clientId}
			 AND MONTH([Date]) = ${month}
			 AND YEAR([Date]) = ${year})\n`;

	if (transactionId1 === 0) {
		stmt += `INSERT INTO [InboundTransaction] ([InboundID], [ClientID], [Month], [Year], [ExpectedAmount], [ReceivedAmount], [Balance], [timestamp])
		VALUES (1, ${clientId}, ${month}, ${year}, @govSubsidy, 0, @govSubsidy, GETDATE());\n`;
	} else {
		stmt += `UPDATE [InboundTransaction] SET
					[ExpectedAmount] = @govSubsidy,
					[Balance] = @govSubsidy - ${receivedGovernmentSubsidy},
					[timestamp] = GETDATE()
				WHERE [TransactionID] = ${transactionId1};\n`;
	}

	if (transactionId2 === 0) {
		stmt += `INSERT INTO [InboundTransaction] ([InboundID], [ClientID], [Month], [Year], [ExpectedAmount], [ReceivedAmount], [Balance], [timestamp])
		VALUES (2, ${clientId}, ${month}, ${year}, @clientContribution, 0, @clientContribution, GETDATE());\n`;
	} else {
		stmt += `UPDATE [InboundTransaction] SET
					[ExpectedAmount] = @clientContribution,
					[Balance] = @clientContribution - ${receivedIncomeTestedFee},
					[timestamp] = GETDATE()
				WHERE [TransactionID] = ${transactionId2};\n`;
	}

	if (transactionId3 === 0) {
		stmt += `INSERT INTO [InboundTransaction] ([InboundID], [ClientID], [Month], [Year], [ExpectedAmount], [ReceivedAmount], [Balance], [timestamp])
		VALUES (3, ${clientId}, ${month}, ${year}, @suppSubsidy, 0, @suppSubsidy, GETDATE());\n`;
	} else {
		stmt += `UPDATE [InboundTransaction] SET
					[ExpectedAmount] = @suppSubsidy,
					[Balance] = @suppSubsidy - ${receivedSuppSubsidy},
					[timestamp] = GETDATE()
				WHERE  [TransactionID] = ${transactionId3};\n`;
	}

	// Commit the transaction
	stmt += database.endTransaction;
	console.log(stmt);
	result = await database.simpleExecute(stmt);
	console.log(result);
	return result;
}
module.exports.insertBlock = insertBlock;
