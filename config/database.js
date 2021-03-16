require('dotenv').config();

module.exports = {
	hrPool : {
		server   : process.env.DB_HOST,
		port     : parseInt(process.env.DB_PORT || 1433),
		database : process.env.DB_NAME,
		user     : process.env.DB_USER,
		password : process.env.DB_PASS,
		pool     : {
			max               : 10,
			min               : 0,
			idleTimeoutMillis : 100000,
		},
		options  : { enableArithAbort: true },
	},
};
