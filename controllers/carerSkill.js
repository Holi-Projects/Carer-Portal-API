const path = require('path');
const fs = require('fs');

const carerSkill = require('../db_apis/carerSkill.js');
const carerDocument = require('./carerDocument.js');

async function getList(req, res, next) {
	console.log('controllers:carerSkill.getList(req, res, next)');
	try {
		let carerId = parseInt(req.params.carerId);
		if (req.user.userType === 'carer') carerId = req.user.userId;
		//console.log(carerId);

		res.status(200).json(await carerSkill.getList(req.user, carerId));
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.getList = getList;

async function get(req, res, next) {
	console.log('controllers:carerSkill.get(req, res, next)');
	try {
		let carerId = parseInt(req.params.carerId);
		if (req.user.userType === 'carer') carerId = req.user.userId;
		//console.log(carerId);
		const id = parseInt(req.params.id);

		const rows = await carerSkill.get(req.user, carerId, id);
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
	console.log('controllers:carerSkill.update(req, res, next)');
	console.log(req.body);
	try {
		let carerId = parseInt(req.params.carerId);
		if (req.user.userType === 'carer') carerId = req.user.userId;
		//console.log(carerId);
		const id = parseInt(req.params.id);

		const result = await carerSkill.update(req.user, carerId, id, req.body);
		//console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(200).send({
				success : 'true',
				message : 'Carer Skill updated successfully',
				id      : id,
				//updatedCarer,
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
	console.log('controllers:carerSkill.insert(req, res, next)');
	try {
		let carerId = parseInt(req.params.carerId);
		if (req.user.userType === 'carer') {
			carerId = req.user.userId;
			req.body.carerSubmittedDate = new Date().toISOString();
		}
		//console.log(carerId);
		req.body.carerId = parseInt(carerId);
		console.log(req.body);

		const result = await carerSkill.insert(req.user, req.body);
		//console.log(result);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(201).send({
				success : 'true',
				message : 'Carer Skill inserted successfully',
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
module.exports.insert = insert;

async function remove(req, res, next) {
	console.log('controllers:carerSkill.remove(req, res, next)');
	try {
		let carerId = parseInt(req.params.carerId);
		if (req.user.userType === 'carer') carerId = req.user.userId;
		//console.log(carerId);
		const id = parseInt(req.params.id);

		// Get list of documents linked to the skill and remove them first
		const docList = await carerDocument.getListDbRecordAndFile(req.user, carerId, { carerSkillId: id });
		for (doc of docList) {
			console.log(doc);
			await carerDocument.removeDbRecordAndFile(req.user, carerId, doc.id);
		}
		if (docList.length > 0) carerDocument.removeDir(docList[0].parentPath);

		const result = await carerSkill.remove(req.user, carerId, id);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return res.status(200).send({
				success : 'true',
				message : 'Carer Skill deleted successfully',
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

async function approve(req, res, next) {
	console.log('controllers:carerSkill.approve(req, res, next)');
	console.log(req.user);

	try {
		const carerId = parseInt(req.params.carerId);
		const id = parseInt(req.params.id);

		if (req.user.userType === 'employee') {
			const result = await carerSkill.approve(req.user, carerId, id);
			if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
				return res.status(200).send({
					success : 'true',
					message : 'Carer Skill approved successfully',
					id      : result.recordset[0].id,
				});
			} else {
				res.status(404).end('200');
			}
		} else {
			res.status(403).end('200');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.approve = approve;
