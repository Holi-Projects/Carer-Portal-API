function formatPhoneDb2Api(dbPhone) {
	let phone = dbPhone;
	if (dbPhone) {
		phone = dbPhone.replace(/\s+/g, '');
		if (phone.length === 8) phone = `03${phone}`;
	}
	return phone;
}
module.exports.formatPhoneDb2Api = formatPhoneDb2Api;

function formatPhoneApi2Db(apiPhone) {
	let phone = apiPhone;
	if (apiPhone && apiPhone.length == 10) {
		if (phone[1] === '4') phone = phone.slice(0, 4) + ' ' + phone.slice(4, 7) + ' ' + phone.slice(7);
		else phone = phone.slice(0, 2) + ' ' + phone.slice(2, 6) + ' ' + phone.slice(6);
	}
	return phone;
}
module.exports.formatPhoneApi2Db = formatPhoneApi2Db;
