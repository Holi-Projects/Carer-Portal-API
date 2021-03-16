function getOffset(date, timeZone) {
	return `(SELECT DATEPART(tz,CAST(${date} AS DATETIME2(0)) AT TIME ZONE '${timeZone}')/60)`;
}
module.exports.getOffset = getOffset;

// function to check if two datetime ranges are overlapped
function areRangesOverlapping(startDateTime, endDateTime, comparedRangeStartDate, comparedRangeEndDate) {
	return `((${startDateTime} >= ${comparedRangeStartDate} AND ${endDateTime} <= ${comparedRangeEndDate})
    OR ((${endDateTime} >= ${comparedRangeEndDate} OR ${endDateTime} IS NULL) AND (${startDateTime} <= ${comparedRangeEndDate} AND ${startDateTime} > ${comparedRangeStartDate}))
    OR (${startDateTime} <= ${comparedRangeStartDate} AND (${endDateTime} >= ${comparedRangeStartDate} AND ${endDateTime} < ${comparedRangeEndDate}))
	OR (${startDateTime} <= ${comparedRangeStartDate} AND ${endDateTime} IS NULL)
	OR (${startDateTime} < ${comparedRangeStartDate} AND ${endDateTime} > ${comparedRangeEndDate}))`;
}
module.exports.areRangesOverlapping = areRangesOverlapping;

// function to check if two datetime ranges are overlapped
function getEachDay(dateRangeList) {
	let dateArray = [];
	dateRangeList.forEach((item) => {
		var currentDate = item.StartDate;
		while (currentDate <= item.EndDate) {
			dateArray.push(new Date(currentDate));
			currentDate = currentDate.addDays(1);
		}
	});

	return [ ...new Set(dateArray) ];
}
module.exports.getEachDay = getEachDay;

function timezoneOffset(timezone, date) {
	return `(SELECT DATEPART(tz, CAST(${date} AS DATETIME2(0)) AT TIME ZONE '${timezone}'))`;
}
module.exports.timezoneOffset = timezoneOffset;

function timezoneOffsetHourPart(timezone, date) {
	return `(SELECT DATEPART(tz, CAST(${date} AS DATETIME2(0)) AT TIME ZONE '${timezone}')/60)`;
}
module.exports.timezoneOffsetHourPart = timezoneOffsetHourPart;

function timezoneOffsetMinutePart(timezone, date) {
	return `((SELECT DATEPART(tz, CAST(${date} AS DATETIME2(0)) AT TIME ZONE '${timezone}') - ((SELECT DATEPART(tz, CAST(${date} AS DATETIME2(0)) AT TIME ZONE '${timezone}')/60)*60))`;
}
module.exports.timezoneOffsetMinutePart = timezoneOffsetMinutePart;

function dbTime2Time(dbTime) {
	return `DATEADD(DAY, DATEDIFF(DAY, ${dbTime}, GETDATE()), ${dbTime})`;
}

function time2dbTime(time) {
	return `DATEADD(DAY, DATEDIFF(DAY, ${time}, '1899-12-30'), ${time})`;
}

// Timezone Offset needs to be added when writing to the database
function utcDate2dbDate(date, timezone) {
	//return `DATEADD(MINUTE,	${timezoneOffset(timezone, date)}, ${date})`;
	return `DATEADD(MINUTE,	${timezoneOffset(timezone, date)}, CAST(${date} AS DATETIME2(0)))`;
}
module.exports.utcDate2dbDate = utcDate2dbDate;

function utcDate2dbTime(date, timezone) {
	return time2dbTime(utcDate2dbDate(date, timezone));
}
module.exports.utcDate2dbTime = utcDate2dbTime;

// Timezone Offset needs to be removed from dates read from the database
function dbDate2utcDate(date, timezone) {
	//return `DATEADD(MINUTE, -${timezoneOffset(timezone, date)}, ${date})`;
	return `DATEADD(MINUTE, -${timezoneOffset(timezone, date)}, CAST(${date} AS DATETIME2(0)))`;
}
module.exports.dbDate2utcDate = dbDate2utcDate;

function dbTime2utcDate(time, timezone) {
	return dbDate2utcDate(dbTime2Time(time), timezone);
}
module.exports.dbTime2utcDate = dbTime2utcDate;
