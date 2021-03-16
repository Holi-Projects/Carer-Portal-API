const database = require('../services/database.js');

async function getList(user, carerId) {
	console.log('DB:carerLanguage.getList(user, carerId)');
	console.log(`carerId: ${carerId}`);

	let query = ``;
	if (carerId !== undefined) {
		// Get carer languages by carer id
		query = `SELECT 
                CL.[Language Ref ID] AS id,
                L.[RefName] AS name,
                CL.[Comments] AS comments
            FROM [Carers Languages] CL 
            JOIN [Ref Types] L ON L.[RefNo] = CL.[Language Ref ID]
            JOIN [Carers] C ON C.[ID] = CL.[Carer ID]
            WHERE C.[ID] = ${carerId} AND C.[CompanyId] = ${user.companyId} 
            ORDER BY L.[RefName]`;
	}

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.getList = getList;

async function get(user, carerId, id) {
	console.log('DB:carerLanguage.get(user, carerId, id)');
	console.log(`carerId: ${carerId}`);
	console.log(`id: ${id}`);

	let query = ``;
	if (carerId !== undefined && id !== undefined) {
		query = `SELECT 
                CL.[Language Ref ID] AS id,
                L.[RefName] AS name,
                CL.[Comments] AS comments
            FROM [Carers Languages] CL 
            JOIN [Ref Types] L ON L.[RefNo] = CL.[Language Ref ID]
            JOIN [Carers] C ON C.[ID] = CL.[Carer ID]
            WHERE CL.[Language Ref ID] = ${id} 
              AND C.[ID] = ${carerId} 
              AND C.[CompanyId] = ${user.companyId}`;
	}
	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}
module.exports.get = get;

async function update(user, carerId, id, data) {
	console.log('DB:carerLanguage.update(user, carerId, id)');

	const query = `UPDATE [Carers Languages] 
              SET [Comments] = '${data.comments}' 
            WHERE [Language Ref ID] = ${id} 
              AND [Carer ID] = ${carerId}`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result;
}
module.exports.update = update;

async function insert(user, data) {
	console.log('DB:carerLanguage.insert(user, data)');
	console.log(data);
	// TODO: Duplicate Detection -- rules need to be defined.
	if (!data.id) {
		return { message: 'Language ID is mandatory' };
	}

	const query = `SELECT [Language Ref ID] AS id
                    FROM [Carers Languages]
                    WHERE [Carer ID] = ${data.carerId} 
                      AND [Language Ref ID] = ${data.id}`;

	console.log(query);
	let result = await database.simpleExecute(query);

	if (result.recordset.length === 0) {
		let fields = [ '[Carer ID]', '[Language Ref ID]' ];
		let values = [ data.carerId, data.id ];

		if (data.comments) {
			fields.push('[Comments]');
			values.push(`'${data.comments}'`);
		}

		const fieldList = fields.join();
		const valueList = values.join();

		const stmt = `INSERT INTO [Carers Languages] (${fieldList}) OUTPUT INSERTED.[Language Ref ID] AS id VALUES (${valueList});`;

		console.log(stmt);
		result = await database.simpleExecute(stmt);
		console.log(result);
	} else {
		console.log('Duplicate detected');
	}
	return result;
}
module.exports.insert = insert;

async function remove(user, carerId, id) {
	console.log('DB:carerAvailability.remove(user, carerId, id)');

	let query = `DELETE FROM [Carers Languages] 
        OUTPUT DELETED.[Language Ref ID] AS id 
        WHERE [Carer ID] = ${carerId}
        AND [Language Ref ID] = ${id}`;

	console.log(query);
	const result = await database.simpleExecute(query);
	console.log(result);
	return result;
}
module.exports.remove = remove;
