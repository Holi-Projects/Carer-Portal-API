const path = require('path');
const fs = require('fs');

const carerDocument = require('../db_apis/carerDocument.js');

function filePath(companyId, carerId, carerSkillId, incidentId) {
	let dir = path.join(process.cwd(), `../Documents/Company/${companyId}/Carers/${carerId}/`);

	if (carerSkillId) dir = path.join(dir, `Skills/${carerSkillId}/`);
	if (incidentId) dir = path.join(dir, `Incidents/${incidentId}/`);

	return dir;
}

// Modularised to provide entry point for carerSkill.remove and incident.remove
async function getListDbRecordAndFile(user, carerId, queryParams) {
	const docList = await carerDocument.getList(user, carerId, queryParams);

	const dir = filePath(user.companyId, carerId, queryParams.carerSkillId, queryParams.incidentId);

	for (i = 0; i < docList.length; i++) {
		const fileInfo = fs.statSync(path.join(dir, docList[i].name));
		if (fileInfo.size) {
			docList[i].isDirectory = false;
			docList[i].parentPath = dir;
			docList[i].size = fileInfo.size;
			docList[i].dateModified = fileInfo.mtime;
			docList[i].type = path.extname(docList[i].name);
		}
		//console.log(docList[i]);
	}
	return docList;
}
module.exports.getListDbRecordAndFile = getListDbRecordAndFile;

async function getList(req, res, next) {
	console.log('controllers:carerDocument.getList(req, res, next)');
	try {
		const companyId = req.user.companyId;
		let carerId = parseInt(req.params.carerId);
		if (req.user.userType === 'carer') carerId = req.user.userId;
		//console.log(carerId);

		//res.status(200).json(await carerDocument.getList(req.user, carerId, req.query));
		/*const docList = await carerDocument.getList(req.user, carerId, req.query);

		const dir = filePath(companyId, carerId, req.query.carerSkillId, req.query.incidentId);
		for (i = 0; i < docList.length; i++) {
			const fileInfo = fs.statSync(path.join(dir, docList[i].name));
			if (fileInfo.size) {
				docList[i].isDirectory = false;
				docList[i].parentPath = dir;
				docList[i].size = fileInfo.size;
				docList[i].dateModified = fileInfo.mtime;
				docList[i].type = path.extname(docList[i].name);
			}
			//console.log(docList[i]);
		}
		res.status(200).json(docList); */
		res.status(200).json(await getListDbRecordAndFile(req.user, carerId, req.query));
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.getList = getList;

async function get(req, res, next) {
	console.log('controllers:carerDocument.get(req, res, next)');
	try {
		const companyId = req.user.companyId;
		let carerId = parseInt(req.params.carerId);
		if (req.user.userType === 'carer') carerId = req.user.userId;
		//console.log(carerId);
		const id = parseInt(req.params.id);

		const rows = await carerDocument.get(req.user, carerId, id);
		if (rows.length === 1) {
			const { name, carerSkillId, incidentId } = rows[0];
			const dir = filePath(companyId, carerId, carerSkillId, incidentId);

			await res.download(dir + name, name, function(err, data) {
				if (err) {
					if (err.code === 'ENOENT') {
						res.status(404);
						res.send('File not found!');
					} else {
						throw err;
					}
				} else {
					console.log('Sent:', dir + name);
					res.status(200).end();
				}
			});
			//res.status(200).json(rows[0]);
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
	console.log('controllers:carerDocument.update(req, res, next)');
	console.log(req.body);

	// TODO Check if name has changed and if so rename the file on the file system using fs.rename()

	try {
		const companyId = req.user.companyId;
		let carerId = parseInt(req.params.carerId);
		if (req.user.userType === 'carer') carerId = req.user.userId;
		//console.log(carerId);
		const id = parseInt(req.params.id);

		// get existing record to see what has changed
		const rows = await carerDocument.get(req.user, carerId, id);
		if (rows.length === 1) {
			const { name, carerSkillId, incidentId } = rows[0];

			const oldDir = filePath(companyId, carerId, carerSkillId, incidentId);
			const newDir = filePath(companyId, carerId, req.body.carerSkillId, req.body.incidentId);

			// make sure new directory exists
			if (oldDir !== newDir) fs.mkdirSync(newDir, { recursive: true });

			fs.renameSync(oldDir + name, newDir + req.body.name);

			const result = await carerDocument.update(req.user, carerId, id, req.body);
			//console.log(result);
			if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
				return res.status(201).send({
					success : 'true',
					message : 'Carer Document updated successfully',
					//updatedCarer,
				});
			} else {
				res.status(404).end('200');
			}
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
	console.log('controllers:carerDocument.insert(req, res, next)');
	try {
		const companyId = req.user.companyId;
		let carerId = parseInt(req.params.carerId);
		if (req.user.userType === 'carer') carerId = req.user.userId;
		//console.log(carerId);
		//req.body.carerId = parseInt(carerId);
		//console.log(req.body);

		if (!req.files) {
			res.send({
				success : false,
				message : 'No file uploaded',
			});
		} else {
			let dir = filePath(companyId, carerId, req.query.carerSkillId, req.query.incidentId);
			const file = req.files['files[]'];

			const fileInfo = { carerId: carerId, name: file.name };
			if (req.query.carerSkillId) fileInfo.carerSkillId = req.query.carerSkillId;
			if (req.query.incidentId) fileInfo.incidentId = req.query.incidentId;

			// TODO duplicate detection needs to be done here to see if file with the same name already exists.
			/*if (fs.existsSync(dir + file.name)) {
				console.log('File with same name exists');
				res.send({
					success : false,
					message : 'File with same name exists',
				});
			}*/

			fs.mkdirSync(dir, { recursive: true });
			file.mv(dir + file.name);

			const result = await carerDocument.insert(req.user, fileInfo);
			//console.log(result);
			if (result.success) {
				return res.status(201).send(result);
			} else {
				res.status(422).send(result);
			}
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.insert = insert;

// Modularised to provide entry point for carerSkill.remove and incident.remove
async function removeDbRecordAndFile(user, carerId, id) {
	// retrieve file details from DB so physical file can be deleted as well
	const rows = await carerDocument.get(user, carerId, id);
	if (rows.length === 1) {
		const { name, carerSkillId, incidentId } = rows[0];

		const dir = filePath(user.companyId, carerId, carerSkillId, incidentId);

		// Delete file
		fs.unlinkSync(dir + name);

		// Delete [Carers Documents] record
		const result = await carerDocument.remove(user, carerId, id);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return id;
		}
	}
	return 0;
}
module.exports.removeDbRecordAndFile = removeDbRecordAndFile;

function removeDir(path) {
	console.log('removeDir()');
	console.log(path);
	fs.rmdirSync(path);
}
module.exports.removeDir = removeDir;

async function remove(req, res, next) {
	console.log('controllers:carerDocument.remove(req, res, next)');

	try {
		//const companyId = req.user.companyId;
		let carerId = parseInt(req.params.carerId);
		if (req.user.userType === 'carer') carerId = req.user.userId;
		//console.log(carerId);
		const id = parseInt(req.params.id);

		if ((await removeDbRecordAndFile(req.user, carerId, id)) === id) {
			return res.status(200).send({
				success : 'true',
				message : 'Carer Document deleted successfully',
				id      : id,
			});
		} else {
			res.status(404).end('200');
		}
		// retrieve file details from DB so physical file can be deleted as well
		/*		const rows = await carerDocument.get(req.user, carerId, id);
		if (rows.length === 1) {
			const { name, carerSkillId, incidentId } = rows[0];

			let dir = path.join(process.cwd(), `../Documents/Company/${companyId}/Carers/${carerId}/`);

			if (carerSkillId) dir = path.join(dir, `Skills/${carerSkillId}/`);
			if (incidentId) dir = path.join(dir, `Incidents/${incidentId}/`);

			// Delete file
			fs.unlinkSync(dir + name);

			// Delete [Carers Documents] record
			const result = await carerDocument.remove(req.user, carerId, id);
			if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
				return res.status(200).send({
					success : 'true',
					message : 'Carer Document deleted successfully',
					id      : result.recordset[0].id,
				});
			} else {
				res.status(404).end('200');
			}
		} else {
			res.status(404).end('200');
		} */
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.remove = remove;
