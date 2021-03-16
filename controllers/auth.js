const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const config = require('../config/auth.config');
const Auth = require('../db_apis/auth');
const systemParameters = require('../db_apis/systemParameters.js');

// TODO: signup() routine yet to be converted to Carer System
//exports.signup = (req, res) => {
//	// Save User to Database
//	User.create({
//		username : req.body.username,
//		email    : req.body.email,
//		password : bcrypt.hashSync(req.body.password, 8),
//	})
//		.then((user) => {
//			if (req.body.roles) {
//				Role.findAll({
//					where : {
//						name : {
//							[Op.or]: req.body.roles,
//						},
//					},
//				}).then((roles) => {
//					user.setRoles(roles).then(() => {
//						res.send({ message: 'User was registered successfully!' });
//					});
//				});
//			} else {
//				// user role = 1
//				user.setRoles([ 1 ]).then(() => {
//					res.send({ message: 'User was registered successfully!' });
//				});
//			}
//		})
//		.catch((err) => {
//			res.status(500).send({ message: err.message });
//		});
//};

exports.signin = (req, res) => {
	console.log('signin(): email = ' + req.body.email);
	//console.log('signin(): password = ' + req.body.password);
	console.log('signin(): userType = ' + req.body.userType);

	// Number of seconds before token expires
	const timeToLive = 57600; // 16 hours
	//const timeToLive = 60; //debug

	Auth.checkUserActive(req.body.email, req.body.userType).then((rows) => {
		//console.log('checkUserActive() returned');
		//console.log(rows);

		const userId = rows[0].Result;
		//console.log(userId);

		if (!userId) {
			console.log('No Active User Found.');
			return res.status(404).send({
				accessToken : null,
				message     : 'No Active User Found.',
			});
		}

		Auth.getUser(userId, req.body.userType)
			.then((rows) => {
				//console.log('rows: ' + rows.length);
				if (rows.length === 0) {
					return res.status(404).send({
						accessToken : null,
						message     : 'User Not found.',
					});
				}
				// save all properties except companyId and password in user object
				const { companyId, timezone, password, passwordSalt, ...user } = rows[0];
				//console.log('user: ' + user.firstName);
				//console.log(`retrieved password: |${password}|`);
				let passwordIsValid = false;
				if (passwordSalt) {
					passwordIsValid = bcrypt.compareSync(req.body.password, passwordSalt);
				} else {
					// TODO: remove else statement once the Access FE is retired and we can store the encrypted password in Employees
					passwordIsValid = req.body.password === password;
				}

				if (!passwordIsValid) {
					return res.status(401).send({
						accessToken : null,
						message     : 'Invalid Password!',
					});
				}

				var token = jwt.sign(
					{ companyId: companyId, companyTimezone: timezone, userId: user.id, userType: req.body.userType },
					config.secret,
					{
						expiresIn : timeToLive,
					}
				);

				// number of milliseconds since 01-01-1970 UTC
				const expiryTime = Date.now() + timeToLive * 1000;

				if (req.body.userType === 'carer' || req.body.userType === 'client') {
					res.status(200).send({
						...user,
						accessToken : token,
						expiresAt   : expiryTime,
					});
				} else {
					var authorities = [];
					Auth.getRoles(user.id).then((roles) => {
						//console.log('roles.length = ' + roles.length);
						for (let i = 0; i < roles.length; i++) {
							authorities.push('ROLE_' + roles[i].name.toUpperCase()); // TODO: replace space in 'Client Manager' with underscore
						}
						//console.log('OK: ' + authorities);
						res.status(200).send({
							...user,
							roles       : authorities,
							accessToken : token,
							expiresAt   : expiryTime,
						});
					});
				}
			})
			.catch((err) => {
				res.status(500).send({ message: err.message });
			});
	});
};

exports.changePassword = (req, res, next) => {
	//console.log('changePassword(): userId = ' + req.user.userId);
	//console.log('changePassword(): userType = ' + req.user.userType);
	//console.log('changePassword(): oldPassword = ' + req.body.oldPassword);
	//console.log('changePassword(): newPassword = ' + req.body.newPpassword);

	// Verify old password
	Auth.getUser(req.user.userId, req.user.userType)
		.then((rows) => {
			//console.log('rows: ' + rows.length);
			if (rows.length === 0) {
				return res.status(404).send({
					accessToken : null,
					message     : 'User Not found.',
				});
			}
			const { password, passwordSalt, firstName, lastName, email } = rows[0];
			let passwordIsValid = false;
			if (passwordSalt) {
				passwordIsValid = bcrypt.compareSync(req.body.oldPassword, passwordSalt);
			} else {
				// TODO: remove else statement once the Access FE is retired and we can store the encrypted password in Employees
				passwordIsValid = req.body.oldPassword === password;
			}

			if (!passwordIsValid) {
				return res.status(401).send({
					message : "Old password doesn't match.",
				});
			}

			// Verity that old and new password are different
			if (req.body.oldPassword === req.body.newPassword) {
				return res.status(401).send({
					message : 'New password cannot be the same as the old password.',
				});
			}

			// Verify new password strenght () https://www.thepolyglotdeveloper.com/2015/05/use-regex-to-test-password-strength-in-javascript/
			const re = RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})');
			if (!re.test(req.body.newPassword)) {
				return res.status(401).send({
					message :
						'New password must contain a lower case character, an upper case character, a digit, a special character and have a minimun length of 8.',
				});
			}

			// Verify that new password doesn't contain First Name, Last Name of Email (before @)
			const pwd = req.body.newPassword.toLowerCase();
			if (pwd.includes(firstName.toLowerCase())) {
				return res.status(401).send({
					message : "Password can't contain First Name",
				});
			} else if (pwd.includes(lastName.toLowerCase())) {
				return res.status(401).send({
					message : "Password can't contain Last Name",
				});
			} else if (pwd.includes(email.substr(0, email.indexOf('@')))) {
				return res.status(401).send({
					message : "Password can't contain email ID",
				});
			} else if (pwd.includes('password')) {
				return res.status(401).send({
					message : "Password can't contain the word 'password'",
				});
			}

			const newPasswordSalt = bcrypt.hashSync(req.body.newPassword, 8);

			Auth.changePassword(req.user, newPasswordSalt).then((result) => {
				if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
					return res.status(200).send({
						success : 'true',
						message : 'Password updated successfully',
						//updatedClient,
					});
				} else {
					res.status(404).end('200');
				}
			});
		})
		.catch((err) => {
			res.status(500).send({ message: err.message });
		});
};

async function forgot(req, res) {
	console.log('forgot(): email = ' + req.body.email);
	console.log('forgot(): userType = ' + req.body.userType);

	let rows = await Auth.checkUserActive(req.body.email, req.body.userType);
	if (rows.length === 0) {
		return res.status(404).end('200');
	}

	const userId = rows[0].Result;
	if (!userId) {
		console.log('No Active User Found.');
		return res.status(404).send({
			message : 'No Active User Found.',
		});
	}

	const token = crypto.randomBytes(20).toString('hex');
	console.log(token);

	// Number of seconds before token expires
	//const timeToLive = 3600; // 1 hour
	//const expiry = new Date(Date.now() + timeToLive * 1000).toISOString();

	// Save token in DB
	await Auth.saveResetToken(token, req.body.userType, userId);

	rows = await systemParameters.getGlobalParameters();
	// console.log(rows)
	// console.log(rows.length)
	if (rows.length === 0) {
		return res.status(404).end('200');
	}

	const {
		serverSMTP,
		portSMTP,
		authenticationTypeSMTP,
		defaultUserNameSMTP,
		defaultPasswordSMTP,
		useSslSMTP,
		sendFromEmail,
	} = rows[0];

	// Send email
	const transporter = nodemailer.createTransport({
		//service : 'gmail',
		host : serverSMTP,
		port : portSMTP,
		auth : {
			user : defaultUserNameSMTP,
			pass : defaultPasswordSMTP,
		},
	});

	//console.log(req);
	const referer = req.headers.referer;

	const mailOptions = {
		from    : sendFromEmail,
		to      : req.body.email,
		subject : 'Link to reset password',
		text    : `You are receiving this because you (or someone else) have requested the reset of the password for your account.
			
Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:
			
${referer}#/reset-password-token/${token}
		
If you did not request this, please ignore this email and your password will remain unchanged.`,
	};

	console.log('sending email');

	transporter.sendMail(mailOptions, (err, response) => {
		if (err) {
			console.error('there was an error: ', err);
		} else {
			console.log('here is the res: ', response);
			res.status(200).json('recovery email sent');
		}
	});
}
module.exports.forgot = forgot;

async function checkResetToken(req, res) {
	console.log('checkResetToken()');
	try {
		const token = req.params.token;

		const rows = await Auth.findResetToken(token);
		if (rows.length === 1) {
			res.status(200).json(rows[0]);
		} else {
			res.status(404).end('200');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.checkResetToken = checkResetToken;

async function resetPassword(req, res) {
	console.log('resetPassword()');
	try {
		const token = req.params.token;

		// retrieve userType and userId using token
		const rows = await Auth.findResetToken(token);
		if (rows.length === 1) {
			const user = rows[0];

			const rows2 = await Auth.getUser(user.userId, user.userType);
			if (rows2.length === 0) {
				return res.status(404).send({
					accessToken : null,
					message     : 'User Not found.',
				});
			}
			const { companyId, firstName, lastName, email } = rows2[0];
			user.companyId = companyId;
			//let passwordIsValid = false;

			// Verify new password strenght () https://www.thepolyglotdeveloper.com/2015/05/use-regex-to-test-password-strength-in-javascript/
			const re = RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})');
			if (!re.test(req.body.password)) {
				return res.status(401).send({
					message :
						'Password must contain a lower case character, an upper case character, a digit, a special character and have a minimun length of 8.',
				});
			}

			// Verify that new password doesn't contain First Name, Last Name of Email (before @)
			const pwd = req.body.password.toLowerCase();
			if (pwd.includes(firstName.toLowerCase())) {
				return res.status(401).send({
					message : "Password can't contain First Name",
				});
			} else if (pwd.includes(lastName.toLowerCase())) {
				return res.status(401).send({
					message : "Password can't contain Last Name",
				});
			} else if (pwd.includes(email.substr(0, email.indexOf('@')))) {
				return res.status(401).send({
					message : "Password can't contain email ID",
				});
			} else if (pwd.includes('password')) {
				return res.status(401).send({
					message : "Password can't contain the word 'password'",
				});
			}

			const passwordSalt = bcrypt.hashSync(req.body.password, 8);

			Auth.changePassword(user, passwordSalt).then((result) => {
				if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
					return res.status(200).send({
						success : 'true',
						message : 'Password reset successfully',
						//updatedClient,
					});
				} else {
					res.status(404).end('200');
				}
			});
		} else {
			res.status(404).end('200');
		}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.resetPassword = resetPassword;
