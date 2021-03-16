const refTask = require('../db_apis/refTask.js');

async function getRefTask(req, res, next) {
	try {
		//const rows = await refTask.getRefTask(req.user);
		//if (rows.length !== 0) {
		//	res.status(200).json(rows);
		//} else {
		//	/* no data found */
		//	res.end('404');
		//}
		res.status(200).json(await refTask.getRefTask(req.user));
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.getRefTask = getRefTask;

async function list(req, res, next) {
	try {
		const rows = await refTask.list(req.user);

		for (const row of rows) {
			row.taskCode = row.taskCode.trim();
			row.taskNameAndCode = row.taskCode.trim() + ' (' + row.taskName + ')';
		}

		res.status(200).json(rows);
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}

module.exports.list = list;
