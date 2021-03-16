const refMedicineAdminCode = require('../db_apis/refMedicineAdminCode.js');

async function list(req, res, next) {
	try {
		// const rows = await refMedicineAdminCode.getRefMedicineAdminCode();
		const rows = await refMedicineAdminCode.list(req.user);
		// console.log(rows)
		// console.log(rows.length)
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.list = list;
