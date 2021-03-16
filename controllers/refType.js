const refType = require('../db_apis/refType.js');

async function getRefType(req, res, next) {
	try {
		//console.log(req.path);
		let i = req.path.lastIndexOf('/');
		let typeName = req.path.substring(i + 1);
		//console.log(typeName);

		const rows = await refType.getRefType(req.user, typeName);
		//console.log(rows);
		//console.log(rows.length);
		res.status(200).json(rows);

		//let dict = {};
		//rows.forEach((row) => {
		//	dict[row.id] = row.name;
		//});

		//res.status(200).json(dict);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.getRefType = getRefType;

async function getList(req, res, next) {
	console.log('controllers:refType.getList(req, res, next)');
	try {
		res.status(200).json(await refType.getList(req.user));
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.getList = getList;

async function get(req, res, next) {
	console.log('controllers:refType.get(req, res, next)');
	try {
		const rows = await refType.get(req.user, parseInt(req.params.id));
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
	console.log('controllers:refType.update(req, res, next)');
	console.log(req.body);
	try {
		const result = await refType.update(req.user, parseInt(req.params.id), req.body);
		//console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(201).send({
				success : 'true',
				message : 'Ref Type updated successfully',
			});
		} else {
			res.status(404).end('200');
		}
	} catch (err) {
		//console.log('----');
		//console.log(err);
		//console.log('----');
		console.error(err.stack);
		next(err);
	}
}
module.exports.update = update;

async function insert(req, res, next) {
	console.log('controllers:refType.insert(req, res, next)');
	try {
		console.log(req.body);
		const result = await refType.insert(req.user, req.body);
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
	console.log('controllers:refType.remove(req, res, next)');
	try {
		const result = await refType.remove(req.user, parseInt(req.params.id));
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(200).send({
				success : 'true',
				message : 'Ref Type deleted successfully',
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
