//requiring path and fs modules
const fs = require('fs');
const path = require('path');

// Get directory structure information
async function fetchDir(context) {
	console.log('Run: function fetchDir(context)');

	let dir = path.join(context.rootPath, context.folder || '');
	if (dir.includes('\\')) dir = dir.replace(/\\/g, '/');

	console.log(context);

	// List all files in a directory in Node.js recursively in a synchronous fashion
	var readSyncDir = function(dir, filelist) {
		var fs = fs || require('fs'),
			files = fs.readdirSync(dir);

		// Sort files by modified date
		files.sort(function(a, b) {
			return fs.statSync(dir + b).mtime.getTime() - fs.statSync(dir + a).mtime.getTime();
		});

		filelist = filelist || [];
		// Recursively fetching the directories and files structure
		files.forEach(function(file) {
			if (fs.statSync(dir + '/' + file).isDirectory()) {
				var fileObj = {
					name        : file,
					isDirectory : true,
					items       : readSyncDir(dir + '/' + file, []),
				};
				filelist.push(fileObj);
			} else {
				var fileSizeInBytes = fs.statSync(dir + '/' + file).size;
				var lastModified = fs.statSync(dir + '/' + file).mtime;
				var fileType = path.extname(file);
				var pathInfo = dir;
				var fileObj = {
					name         : file,
					isDirectory  : false,
					type         : fileType,
					size         : fileSizeInBytes,
					dateModified : lastModified,
					parentPath   : pathInfo,
				};
				filelist.push(fileObj);
			}
		});

		return filelist;
	};

	return readSyncDir(dir, []);
}

module.exports.fetchDir = fetchDir;
