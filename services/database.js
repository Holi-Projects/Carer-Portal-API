const sql = require('mssql');
const dbConfig = require('../config/database.js');
// async/await style:
const pool = new sql.ConnectionPool(dbConfig.hrPool);

async function initialize() {
	const pool = new sql.ConnectionPool(dbConfig.hrPool);
}
module.exports.initialize = initialize;

async function close() {
	await pool.close();
}
module.exports.close = close;

function simpleExecute(statement) {
	return new Promise(async (resolve, reject) => {
		try {
			if (!pool.connected) await pool.connect();
			const request = pool.request(); // or: new sql.Request(pool1)
			const result = request.query(statement);
			console.dir(result);
			resolve(result);
		} catch (err) {
			reject(err);
		}
	});
}
module.exports.simpleExecute = simpleExecute;

function runStoredProcedure(proc, inParams, outParams) {
	console.log(proc);
	return new Promise(async (resolve, reject) => {
		try {
			if (!pool.connected) await pool.connect();
			const request = pool.request();
			inParams.forEach(function(param) {
				//console.log(param);
				request.input(param.name, param.type, param.value);
			});
			outParams.forEach(function(param) {
				request.output(param.name, param.type);
			});
			request.execute(proc, (err, result) => {
				//console.log(result.recordset[0].Result);
				// ... error checks
				if (err) console.log(err);
				resolve(result);
			});
		} catch (err) {
			console.log(err);
			reject(err);
		}
	});
}
module.exports.runStoredProcedure = runStoredProcedure;

const startTransaction = `
BEGIN TRY
BEGIN TRANSACTION ;
SET IMPLICIT_TRANSACTIONS ON;\n`;
module.exports.startTransaction = startTransaction;

const endTransaction = `
COMMIT TRANSACTION;  
END TRY\n
BEGIN CATCH
   IF @@TRANCOUNT > 0
	   ROLLBACK TRAN

	   DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE()
	   DECLARE @ErrorSeverity INT = ERROR_SEVERITY()
	   DECLARE @ErrorState INT = ERROR_STATE()

   -- Use RAISERROR inside the CATCH block to return error  
   -- information about the original error that caused  
   -- execution to jump to the CATCH block.  
   RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
END CATCH
IF @@TRANCOUNT > 0  
	COMMIT TRANSACTION
GO`;
module.exports.endTransaction = endTransaction;
