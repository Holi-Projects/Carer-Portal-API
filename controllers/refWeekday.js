function getRefWeekday(req, res, next) {
	const rows = [
		{ id: 1, shortName: 'Sun', name: 'Sunday' },
		{ id: 2, shortName: 'Mon', name: 'Monday' },
		{ id: 3, shortName: 'Tue', name: 'Tuesday' },
		{ id: 4, shortName: 'Wed', name: 'Wednesday' },
		{ id: 5, shortName: 'Thu', name: 'Thursday' },
		{ id: 6, shortName: 'Fri', name: 'Friday' },
		{ id: 7, shortName: 'Sat', name: 'Saturday' },
	];
	res.status(200).json(rows);
}

module.exports.getRefWeekday = getRefWeekday;
