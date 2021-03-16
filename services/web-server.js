const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const webServerConfig = require('../config/web-server.js');
const router = require('../routes/router.js');
const publicDir = require('path').join(__dirname, '/public');
let httpServer;

function initialize() {
	return new Promise((resolve, reject) => {
		const app = express();

		httpServer = http.createServer(app);

		// File upload middleware
		app.use(fileUpload({ createParentPath: true }));

		// Body Parser Middleware
		app.use(bodyParser.json({ type: 'application/json' }));
		app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

		// Setting the path of the public folder :
		app.use(express.static(publicDir));

		const corsOptions = {
			origin : 'http://localhost:3000',
		};
		app.use(cors(corsOptions));

		// Combines logging info from request and response
		app.use(morgan('combined'));

		// Mount the router at /api so all its routes start with /api
		app.use('/api', router);

		// Final error handler
		// REF: https://expressjs.com/en/guide/error-handling.html
		app.use((err, req, res, next) => {
			errorHandler(err, req, res, next);
		});

		function errorHandler(err, req, res, next) {
			res.status(500);
			res.render('error', { error: err });
		}

		httpServer
			.listen(webServerConfig.port)
			.on('listening', () => {
				console.log(`Web server listening on localhost:${webServerConfig.port}`);
				resolve();
			})
			.on('error', (err) => {
				reject(err);
			});
	});
}
module.exports.initialize = initialize;

function close() {
	return new Promise((resolve, reject) => {
		httpServer.close((err) => {
			if (err) {
				reject(err);
				return;
			}
			resolve();
		});
	});
}
module.exports.close = close;
