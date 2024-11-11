const dotenv = require('dotenv');
const express = require('express');
const session = require('express-session');
const { engine } = require('express-handlebars');

const path = require('path');
const xss = require('xss-clean'); // Data sanitization - XSS

dotenv.config({ path: `${__dirname}/config.env` });

const formRouter = require('./routes/formRoutes');
const errorRouter = require('./routes/errorRotes');

const {
	logLineSync,
	logLineAsync,
	loggerMiddleware,
} = require('./utils/logger');

const logFileName = '_server.log';
const logFilePath = path.resolve('logs', logFileName);

const webserver = express();

// template engine
webserver.engine('handlebars', engine());
webserver.set('view engine', 'handlebars');
webserver.set('views', path.join(__dirname, 'views')); 

webserver.use(express.static(path.join(__dirname, 'public')));

webserver.use(
	session({
		secret: process.env.SECRET_KEY,
		resave: false,
		saveUninitialized: true,
	}),
);

const port = process.env.PORT || 7180;

// Body parser
webserver.use(express.json({ limit: '10kb' })); // content-type: application/json
webserver.use(express.urlencoded({ extended: true, limit: '10kb' })); // content-type: application/x-www-form-urlencoded

// Data sanitization against XSS
webserver.use(xss());

webserver.use(loggerMiddleware);

process.on('uncaughtException', (err) => {
	const logLine = `UNCAUGHT EXCEPTION!💥 Shutting down... ${err.name}: ${err.message}`;
	logLineSync(logFilePath, logLine);
	process.exit(1);
});

webserver.use('/', formRouter);

// 404 ERROR
webserver.use(errorRouter);

webserver.listen(port, () => {
	const logLine = `Web server running on port  ${port}, process.pid = ${process.pid}`;
	console.log(process.env.NODE_ENV);
	logLineAsync(logFilePath, logLine);
});

process.on('unhandledRejection', (err) => {
	const logLine = `UNHANDLED REJECTION!💥 Shutting down... ${err.name}: ${err.message}`;
	logLineSync(logFilePath, logLine);
	process.exit(1);
});
