const systemParameters = require('../db_apis/systemParameters.js');

/*async function getSystemParameters(req, res, next) {
	try {
		const rows = await systemParameters.getSystemParameters(req.user);
		// console.log(rows)
		// console.log(rows.length)
		if (rows.length === 1) {
			res.status(200).json(rows[0]);
		} else {
			res.status(404).end('200');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.getSystemParameters = getSystemParameters; */

async function get(req, res, next) {
	//console.log('controllers:systemParameters.get(req, res, next)');
	//console.log(req.body);

	try {
		const rows = await systemParameters.get(req.user);
		// console.log(rows)
		// console.log(rows.length)
		if (rows.length === 1) {
			res.status(200).json(rows[0]);
		} else {
			res.status(404).end('200');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.get = get;

async function update(req, res, next) {
	//console.log('controllers:systemParameters.update(req, res, next)');
	//console.log(req.body);

	try {
		const result = await systemParameters.update(req.user, req.body);
		//console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(201).send({
				success : 'true',
				message : 'Sytem Parameters updated successfully',
				//updatedSystemParameters,
			});
		} else {
			res.status(404).end('200');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.update = update;
