const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');
const Auth = require('../db_apis/auth.js');

verifyToken = (req, res, next) => {
	//console.log('verifyToken()');
	let token = req.headers['x-access-token'];

	if (!token) {
		return res.status(403).send({
			message : 'No token provided!',
		});
	}
	//console.log(`token: ${token}`);

	jwt.verify(token, config.secret, (err, decoded) => {
		if (err) {
			return res.status(401).send({
				message : 'Unauthorized!',
			});
		}
		req.user = decoded;
		//console.log(`req.user: ${req.user.userId}, ${req.user.companyId}, ${req.user.companyTimezone}`);
		next();
	});
};

isAdministrator = (req, res, next) => {
	Auth.getRoles(req.user.userId).then((roles) => {
		for (let i = 0; i < roles.length; i++) {
			if (roles[i].name === 'Administrator') {
				next();
				return;
			}
		}

		res.status(403).send({
			message : 'Require Administrator Role!',
		});
		return;
	});
};

isSchedule = (req, res, next) => {
	Auth.getRoles(req.user.userId).then((roles) => {
		for (let i = 0; i < roles.length; i++) {
			if (roles[i].name === 'Schedule') {
				next();
				return;
			}
		}

		res.status(403).send({
			message : 'Require Schedule Role!',
		});
		return;
	});
};

isClients = (req, res, next) => {
	Auth.getRoles(req.user.userId).then((roles) => {
		for (let i = 0; i < roles.length; i++) {
			if (roles[i].name === 'Clients') {
				next();
				return;
			}
		}

		res.status(403).send({
			message : 'Require Clients Role!',
		});
		return;
	});
};

isAgencies = (req, res, next) => {
	Auth.getRoles(req.user.userId).then((roles) => {
		for (let i = 0; i < roles.length; i++) {
			if (roles[i].name === 'Agencies') {
				next();
				return;
			}
		}

		res.status(403).send({
			message : 'Require Agencies Role!',
		});
		return;
	});
};

isCarers = (req, res, next) => {
	Auth.getRoles(req.user.userId).then((roles) => {
		for (let i = 0; i < roles.length; i++) {
			if (roles[i].name === 'Carers') {
				next();
				return;
			}
		}

		res.status(403).send({
			message : 'Require Carers Role!',
		});
		return;
	});
};

isAccounts = (req, res, next) => {
	Auth.getRoles(req.user.userId).then((roles) => {
		for (let i = 0; i < roles.length; i++) {
			if (roles[i].name === 'Accounts') {
				next();
				return;
			}
		}

		res.status(403).send({
			message : 'Require Accounts Role!',
		});
		return;
	});
};

isTimesheets = (req, res, next) => {
	Auth.getRoles(req.user.userId).then((roles) => {
		for (let i = 0; i < roles.length; i++) {
			if (roles[i].name === 'Timesheets') {
				next();
				return;
			}
		}

		res.status(403).send({
			message : 'Require Client Timesheets Role!',
		});
		return;
	});
};

isClientManager = (req, res, next) => {
	Auth.getRoles(req.user.userId).then((roles) => {
		for (let i = 0; i < roles.length; i++) {
			if (roles[i].name === 'Client Manager') {
				next();
				return;
			}
		}

		res.status(403).send({
			message : 'Require Client Manager Role!',
		});
		return;
	});
};

const authJwt = {
	verifyToken     : verifyToken,
	isAdministrator : isAdministrator,
	isSchedule      : isSchedule,
	isClients       : isClients,
	isAgencies      : isAgencies,
	isCarers        : isCarers,
	isAccounts      : isAccounts,
	isTimesheets    : isTimesheets,
	isClientManager : isClientManager,
};

module.exports = authJwt;
