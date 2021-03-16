const fetch = require('node-fetch');
require('dotenv').config();

//const { URLSearchParams } = require('url');
const systemParameters = require('../db_apis/systemParameters.js');
const contactHistory = require('../db_apis/contactHistory.js');
//const { rows } = require('mssql');

async function sendSMS(req, res, next) {
	//console.log('Control:sendSMS(req, res, next)');
	//console.log(req.body);

	try {
		/*rows = await systemParameters.getGlobalParameters();
		if (rows.length === 1) {
		}*/
		const rows = await systemParameters.get(req.user);
		if (rows.length === 1) {
			sys = rows[0];
			let contactHistoryId = 0;
			if (sys.logSmsToContactHistory) {
				// save a record in contact history
				const rec = {
					employeeId : req.user.userId,
					comments   : `SMS to ${req.body.destination}: ${req.body.content}`,
				};
				if (req.body.clientId) rec.clientId = req.body.clientId;
				if (req.body.carerId) rec.carerId = req.body.carerId;
				if (req.body.agencyId) rec.agencyId = req.body.agencyId;

				const result = await contactHistory.insert(req.user, rec);
				//console.log(result);
				if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
					contactHistoryId = result.recordset[0].id;
				}
			}

			// obtain OAuth access token
			fetch(`https://api.${sys.smsProvider}/v2/oauth/access_token`, {
				method  : 'POST',
				headers : { 'Content-Type': 'application/x-www-form-urlencoded' },
				body    : `grant_type=password&username=${sys.smsAccount}&password=${sys.smsPassword}`,
			})
				.then((response) => response.json())
				.then((json) => {
					//console.log(json);
					const access_token = json.access_token;

					// send SMS
					const replyPath = `http://${process.env.SMS_REPLY_HOST}:${process.env.HTTP_PORT}/api/sms/reply`;
					// console.log(replyPath);
					let replyParams = 'phone=#FROM#&message=#MSG#&dateSent=#SENTDTS#&dateReceived=#RCVDDTS#';
					if (sys.logSmsToContactHistory && contactHistoryId)
						replyParams += `&correlationId=${contactHistoryId}`;
					fetch(`https://api.${sys.smsProvider}/v2/message/send`, {
						method  : 'POST',
						headers : {
							Authorization  : `Bearer ${access_token}`,
							Accept         : 'application/json',
							'Content-Type' : 'application/json',
						},
						body    : JSON.stringify({
							Message    : req.body.content,
							Recipients : [ req.body.destination ],
							ReplyType  : 'HTTPPOST',
							ReplyPath  : `${replyPath}?${replyParams}`,
						}),
					})
						.then((result) => result.json())
						.then((json) => {
							//console.log(json);

							res.status(200).send({
								result : 'success',
							});
						});
				});
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.sendSMS = sendSMS;

async function receiveReply(req, res, next) {
	//console.log('Control:receiveReply(req, res, next)');
	//console.log(req.body);

	try {
		// if we find a correlationId being returned, then the logSmsToContactHistory system parameter must have been set when sending the originating SMS
		if (req.body.correlationId) {
			const rows = await contactHistory.getIds(req.body.correlationId);
			if (rows.length === 1) {
				// save the reply also in contact history
				const rec = {
					comments : `SMS from ${req.body.phone}: ${req.body.message}`,
				};
				const row = rows[0];
				if (row.clientId) rec.clientId = row.clientId;
				if (row.carerId) rec.carerId = row.carerId;
				if (row.agencyId) rec.agencyId = row.agencyId;
				if (row.employeeId) rec.employeeId = row.employeeId;

				const result = await contactHistory.insert({ companyId: row.companyId }, rec);
				//console.log(result);
				//if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
			}
		}
		return res.status(200).send({
			success : 'true',
			message : 'SMS Reply Received',
			//id      : result.recordset[0].id,
		});
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.receiveReply = receiveReply;
