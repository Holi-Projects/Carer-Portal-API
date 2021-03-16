//requiring path and fs modules
// const path = require('path');
const fs = require('fs');
const fileBrowser = require('../db_apis/fileManager.js');
const path = require('path');
const carerDocument = require('../db_apis/carerDocument.js');

//joining path of directory
// const dir = path.join(__dirname, 'Documents');
// const basePath = require('../config/path');

async function fetchDir(req, res, next) {
	try {
		const context = {};
		context.rootPath = req.query.rootPath;
		context.folder = req.query.folder;
		const rows = await fileBrowser.fetchDir(context);
		console.log(rows);
		// console.log("we are here")
		res.status(200).json(rows);
		// if (rows.length > 0) {
		// 	res.status(200).json(rows);
		//   } else { /* no data found */
		//   //   res.status(404).end('404');
		// 	res.end('404');
		// }
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.fetchDir = fetchDir;

async function fetchPdf(req, res, next) {
	console.log('control: fetchPdf(req, res, next - filePdf.js');

	try {
		filePath = path.join(req.query.rootPath, req.query.fileName);
		fileName = req.query.fileName;

		await res.sendFile(filePath, function(err, data) {
			if (err) {
				if (err.code === 'ENOENT') {
					res.status(404);
					res.send('File not found!');
				} else {
					throw err;
				}
			} else {
				console.log('Sent:', fileName);
				res.status(200).end();
			}
		});
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.fetchPdf = fetchPdf;

async function upload(req, res, next) {
	console.log('control:fileManager.upload(req, res, next)');
	console.log(req.user);

	try {
		if (!req.files) {
			res.send({
				status  : false,
				message : 'No file uploaded',
			});
		} else {
			//console.log(req.files);
			//console.log(req.files['files[]']);
			//console.log(req.files['files[]'].name);
			let file = req.files['files[]'];

			let uploadDir = './uploads/';

			console.log(req.query.carerId);
			console.log(req.query.carerSkillId);
			const companyId = req.user.companyId;
			let carerId = req.query.carerId;
			if (req.user.userType === 'carer') carerId = req.user.userId;
			const carerSkillId = req.query.carerSkillId;
			if (carerId && carerSkillId) {
				uploadDir = `../Documents/Company/${companyId}/Carers/${carerId}/Carers_Skills/${carerSkillId}/`;
				fs.mkdirSync(uploadDir, { recursive: true });
			}

			//Use the mv() method to place the file in upload directory (i.e. "uploads")
			file.mv(uploadDir + file.name);

			// Lodge the file name in the [Carers Documents] table
			const result = await carerDocument.insert(req.user, { carerId: carerId, carerSkillId, name: file.name });

			//send response
			res.send({
				status  : true,
				message : 'File is uploaded',
				data    : {
					name     : file.name,
					mimetype : file.mimetype,
					size     : file.size,
				},
			});
		}
	} catch (err) {
		res.status(500).send(err);
	}
}
module.exports.upload = upload;

async function getItems(req, res, next) {
	console.log('control:fileManager.getItems(req, res, next)');
	//console.log(req.user);

	try {
		//const items = fileBrowser.getItems(req.query.parentDirectory);
		//console.log(items);
		const parentDirectory = req.query.parentDirectory;
		const items = [];
		const files = fs.readdirSync(parentDirectory, { withFileTypes: true });
		files.forEach((file) => {
			const item = {
				name        : file.name,
				isDirectory : file.isDirectory(),
				type        : path.extname(file.name),
				parentPath  : parentDirectory,
				path        : path.join(parentDirectory, file.name),
			};
			const fileInfo = fs.statSync(item.path);
			item.size = fileInfo.size;
			item.dateModified = fileInfo.mtime;

			items.push(item);
		});

		res.status(200).json(items);
	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
}
module.exports.getItems = getItems;

async function createDirectory(req, res, next) {
	console.log('control:fileManager.createDirectory(req, res, next)');
	//console.log(req.user);

	try {
		//console.log(req.body);
		//fileBrowser.createDirectory(req.body.root, req.body.parentDirectory, req.body.name);
		const { root, parentDirectory, name } = req.body;
		fs.mkdirSync(path.join(root, parentDirectory.path, name));
		res.status(201).send({ status: true });
	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
}
module.exports.createDirectory = createDirectory;

async function renameItem(req, res, next) {
	console.log('control:fileManager.renameItem(req, res, next)');
	//console.log(req.user);

	try {
		//console.log(req.body);
		//fileBrowser.renameItem(req.body.root, req.body.item, req.body.newName);
		const { root, item, newName } = req.body;
		fs.renameSync(path.join(root, item.path), path.join(root, item.parentPath, newName));
		res.status(200).send({ status: true });
	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
}
module.exports.renameItem = renameItem;

async function deleteItem(req, res, next) {
	console.log('control:fileManager.deleteItem(req, res, next)');
	//console.log(req.user);

	try {
		//console.log(req.body);
		//fileBrowser.deleteItem(req.body.root, req.body.item);
		const { root, item } = req.body;
		const fullPath = path.join(root, item.path);
		if (item.isDirectory) {
			fs.rmdirSync(fullPath);
		} else {
			fs.unlinkSync(fullPath);
		}
		res.status(200).send({ status: true });
	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
}
module.exports.deleteItem = deleteItem;

async function copyItem(req, res, next) {
	console.log('control:fileManager.copyItem(req, res, next)');
	//console.log(req.user);

	try {
		//console.log(req.body);
		//fileBrowser.copyItem(req.body.root, req.body.item, req.body.destinationDirectory);
		const { root, item, destinationDirectory } = req.body;
		fs.copyFileSync(path.join(root, item.path), path.join(root, destinationDirectory.path, item.name));
		res.status(200).send({ status: true });
	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
}
module.exports.copyItem = copyItem;

async function moveItem(req, res, next) {
	console.log('control:fileManager.moveItem(req, res, next)');
	//console.log(req.user);

	try {
		//console.log(req.body);
		//fileBrowser.moveItem(req.body.root, req.body.item, req.body.destinationDirectory);
		const { root, item, destinationDirectory } = req.body;
		fs.renameSync(path.join(root, item.path), path.join(root, destinationDirectory.path, item.name));
		res.status(200).send({ status: true });
	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
}
module.exports.moveItem = moveItem;

async function uploadFileChunk(req, res, next) {
	console.log('control:fileManager.uploadFileChunk(req, res, next)');
	//console.log(req.user);

	try {
		//console.log(req.body.arguments);
		const arguments = JSON.parse(req.body.arguments);
		//console.log(arguments);
		//console.log(req.files);

		// make sure temp directory exists
		const tempDir = path.join(arguments.root, 'temp');
		fs.mkdirSync(tempDir, { recursive: true });

		// append chunk to temporary file
		const tempPath = path.join(tempDir, arguments.chunkMetadata.UploadId);
		fs.appendFileSync(tempPath, req.files.chunk.data);

		// Save the file to the final destination if all the chunks are received.
		if (arguments.chunkMetadata.Index === arguments.chunkMetadata.TotalCount - 1) {
			// check if destination already exists to avoid overwriting
			const fileName = arguments.chunkMetadata.FileName;
			let fullPath = path.join(arguments.root, arguments.destinationId, fileName);
			for (let i = 1; fs.existsSync(fullPath); i++) {
				// change file name to 'name (i).ext'
				const fileType = path.extname(fileName);
				const baseName = fileName.substring(0, fileName.length - fileType.length);
				fullPath = path.join(arguments.root, arguments.destinationId, `${baseName} (${i})${fileType}`);
			}
			console.log(fullPath);
			fs.renameSync(tempPath, fullPath);
		}
		res.status(200).send({ status: true });
	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
}
module.exports.uploadFileChunk = uploadFileChunk;

async function downloadItem(req, res, next) {
	console.log('control:fileManager.downloadItem(req, res, next)');
	//console.log(req.user);

	try {
		console.log(req.query);
		//fileBrowser.downloadItems(req.body.items);
		const fullPath = path.join(req.query.parentPath, req.query.name);
		console.log(fullPath);
		await res.download(fullPath, req.query.name, function(err, data) {
			//await res.sendFile(fullPath, function(err, data) {
			if (err) {
				console.log(err);
				if (err.code === 'ENOENT') {
					res.status(404);
					res.send('File not found!');
				} else {
					throw err;
				}
			} else {
				console.log('Sent:', fullPath, req.query.name);
				//res.status(200).end();
			}
		});
	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
}
module.exports.downloadItem = downloadItem;
