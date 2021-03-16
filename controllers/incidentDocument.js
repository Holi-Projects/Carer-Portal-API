const path = require('path');
const fs = require('fs');

const incidentDocument = require('../db_apis/incidentDocument.js');

function filePath(companyId, incidentId, incidentDocNo, fileName) {
	return path.join(
		process.cwd(),
		`../Documents/Company/${companyId}/Incidents/${incidentId}/${incidentDocNo}~${fileName}`
	);
}

// Modularised to provide entry point for incident.remove
async function getListDbRecordAndFile(user, queryParams) {
	const docList = await incidentDocument.getList(user, queryParams);

	for (i = 0; i < docList.length; i++) {
		const fileInfo = fs.statSync(filePath(user.companyId, docList[i].incidentId, docList[i].id, docList[i].name));
		if (fileInfo.size) {
			docList[i].isDirectory = false;
			//docList[i].parentPath = dir;
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
	console.log('controllers:incidentDocument.getList(req, res, next)');
	console.log(req.query);
	try {
		res.status(200).json(await getListDbRecordAndFile(req.user, req.query));
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.getList = getList;

async function get(req, res, next) {
	console.log('controllers:incidentDocument.get(req, res, next)');
	try {
		const companyId = req.user.companyId;
		const id = parseInt(req.params.id);

		const rows = await incidentDocument.get(req.user, id);
		if (rows.length === 1) {
			const { name, incidentId } = rows[0];

			await res.download(filePath(companyId, incidentId, id, name), name, function(err, data) {
				if (err) {
					if (err.code === 'ENOENT') {
						res.status(404);
						res.send('File not found!');
					} else {
						throw err;
					}
				} else {
					console.log('Sent:', filePath(companyId, incidentId, id, name));
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
	console.log('controllers:incidentDocument.update(req, res, next)');
	console.log(req.body);

	// TODO Check if name has changed and if so rename the file on the file system using fs.rename()

	try {
		const companyId = req.user.companyId;
		let carerId = parseInt(req.params.carerId);
		if (req.user.userType === 'carer') carerId = req.user.userId;
		//console.log(carerId);
		const id = parseInt(req.params.id);

		// get existing record to see what has changed
		const rows = await incidentDocument.get(req.user, id);
		if (rows.length === 1) {
			const { name, incidentId } = rows[0];

			if (req.body.name && req.body.name !== name)
				fs.renameSync(
					filePath(companyId, incidentId, id, name),
					filePath(companyId, incidentId, id, req.body.name)
				);

			const result = await incidentDocument.update(req.user, id, req.body);
			//console.log(result);
			if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
				return res.status(200).send({
					success : 'true',
					message : 'Incident Document updated successfully',
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
	console.log('controllers:incidentDocument.insert(req, res, next)');
	try {
		const companyId = req.user.companyId;

		if (!req.files) {
			res.send({
				success : false,
				message : 'No file uploaded',
			});
		} else {
			const file = req.files['files[]'];

			const fileInfo = { name: file.name, incidentId: req.query.incidentId };
			const result = await incidentDocument.insert(req.user, fileInfo);
			//console.log(result);
			if (result.success) {
				file.mv(filePath(companyId, req.query.incidentId, result.id, file.name));

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
async function removeDbRecordAndFile(user, id) {
	// retrieve file details from DB so physical file can be deleted as well
	const rows = await incidentDocument.get(user, id);
	if (rows.length === 1) {
		const { name, incidentId } = rows[0];

		// Delete file
		fs.unlinkSync(filePath(user.companyId, incidentId, id, name));

		// Delete [Carers Documents] record
		const result = await incidentDocument.remove(user, id);
		if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			return id;
		}
	}
	return 0;
}
module.exports.removeDbRecordAndFile = removeDbRecordAndFile;

async function remove(req, res, next) {
	console.log('controllers:incidentDocument.remove(req, res, next)');

	try {
		const id = parseInt(req.params.id);

		if ((await removeDbRecordAndFile(req.user, id)) === id) {
			return res.status(200).send({
				success : 'true',
				message : 'Incident Document deleted successfully',
				id      : id,
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
