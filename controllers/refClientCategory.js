const refClientCategory = require('../db_apis/refClientCategory.js');

async function getRefClientCategory(req, res, next) {
	try {
		const rows = await refClientCategory.getRefClientCategory(req.user);
		// console.log(rows)
		// console.log(rows.length)
		res.status(200).json(rows);

		//let dict = {};
		//rows.forEach((row) => {
		//	dict[row.id] = { name: row.name, colour: row.colour };
		//});

		//res.status(200).json(dict);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.getRefClientCategory = getRefClientCategory;

async function list(req, res, next) {
	try {
		const rows = await refClientCategory.list(req.user);
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.list = list;
