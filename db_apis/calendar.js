const booking = require('../db_apis/booking.js');
const carer = require('../db_apis/carer.js');
const carerUnavailability = require('../db_apis/carerUnavailability');
const dateTimeUtil = require('../utils/dateTimeUtil');

async function getCalendar(user, carerId, queryParams) {
	console.log('Run: function getCalendar(user, carerId, queryParams)');
	console.log(`carerId: ${carerId}`);

	queryParams.carerId = carerId;
	const _bookingEvents = booking.getScheduledBooking(user, queryParams);
	const _unavailableEvents = carerUnavailability.getList(user, carerId, queryParams);
	const _unavailableDays = carer.getCarerUnavailableDay(user, carerId, queryParams);

	const bookingEvents = await _bookingEvents;
	const unavailableEvents = await _unavailableEvents;
	const unavailableDays = await _unavailableDays;

	var calendarObj = {};
	calendarObj.events = [ ...unavailableEvents, ...bookingEvents ];
	calendarObj.unavailableDays = dateTimeUtil.getEachDay(unavailableDays);

	//https://date-fns.org/v1.29.0/docs/eachDay
	console.log(calendarObj);
	// const result = await database.simpleExecute(query);
	return calendarObj;
}
module.exports.getCalendar = getCalendar;
