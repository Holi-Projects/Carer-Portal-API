const refSkill = require('../db_apis/refSkill.js');

async function list(req, res, next) {
	// console.log('controllers:refSkill.getList(req, res, next)');
	console.log('controllers:refSkill.list(req, res, next)');
	try {
		// const rows = await refSkill.getList(req.user);
		const rows = await refSkill.list(req.user);
		// console.log(rows)
		// console.log(rows.length)
		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.list = list;

async function get(req, res, next) {
	console.log('controllers:refSkill.get(req, res, next)');
	try {
		const rows = await refSkill.get(req.user, req.params.id);
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
	console.log('controllers:refSkill.update(req, res, next)');
	try {
		const skillId = parseInt(req.params.id, 10);
		console.log(skillId);
		console.log(req.body);

		/*// TODO: de-marshall locality into town, state and postcode
		if (req.body.locality) {
			let result = req.body.locality.match(/^(.*)\s([A-Z]+)\s(\d+)$/);
			console.log(result);
			req.body.locality = result[1];
			req.body.state = result[2];
			req.body.postcode = result[3];
		}*/

		const result = await refSkill.update(req.user, skillId, req.body);
		//console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(201).send({
				success : 'true',
				message : 'Skill updated successfully',
				//updatedClient,
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

async function insert(req, res, next) {
	console.log('controllers:refSkill.insert(req, res, next)');
	try {
		console.log(req.body);
		const result = await refSkill.insert(req.user, req.body);
		//console.log(result);
		if (result.success) {
			return res.status(201).send(result);
		} else {
			res.status(422).send(result);
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.insert = insert;

async function remove(req, res, next) {
	console.log('controllers:refSkill.remove(req, res, next)');
	try {
		const result = await refSkill.remove(req.user, req.params.id);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(200).send({
				success : 'true',
				message : 'Skill deleted successfully',
				id      : result.recordset[0].id,
			});
		} else {
			res.status(404).end('200');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.remove = remove;
