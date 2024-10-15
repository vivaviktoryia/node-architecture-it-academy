const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const { xss } = require('express-xss-sanitizer'); // Data sanitization - XSS

dotenv.config({ path: `${__dirname}/config.env` });

const {
	logLineSync,
	logLineAsync,
	loggerMiddleware,
} = require('./utils/logger');

const { loadStatistics, saveStatistics } = require('./utils/statistics');
const { toXML, toHTML } = require('./utils/parseData');

const { catchAsync } = require('./utils/catchAsync');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./utils/globalErrorHandler');

const statFileName = 'statisticResults.txt';
const statFilePath = path.resolve('data', statFileName);
const logFileName = '_server.log';
const logFilePath = path.resolve('logs', logFileName);
const variants = require('./data/variants');

const webserver = express();
const port = process.env.PORT || 7181;

webserver.set('view engine', 'pug');
webserver.set('views', path.join(__dirname, 'views'));

// Body parser
webserver.use(express.json({ limit: '10kb' })); // content-type: application/json
webserver.use(express.urlencoded({ extended: true, limit: '10kb' })); // content-type: application/x-www-form-urlencoded

// Data sanitization against XSS
webserver.use(xss());

webserver.use(loggerMiddleware);
webserver.use(express.static(path.join(__dirname, 'public')));

process.on('uncaughtException', (err) => {
	const logLine = `UNCAUGHT EXCEPTION!💥 Shutting down... ${err.name}: ${err.message}`;
	logLineSync(logFilePath, logLine);
	process.exit(1);
});

webserver.get(
	'/api/v1/variants',
	catchAsync(async (req, res, next) => {
		if (!variants)
			return next(new AppError('Variants were not provided!', 400));
		res
			.set({
				'Content-Type': 'application/json',
			})
			.status(200)
			.json({
				status: 'success',
				data: {
					data: variants,
				},
			});
	}),
);

webserver.post(
	'/api/v1/stat',
	catchAsync(async (req, res, next) => {
		const statistics = await loadStatistics(statFilePath);
		if (!statistics || !variants)
			return next(
				new AppError('Statistics or variants were not provided!', 400),
			);

		const stats = variants.map((variant) => ({
			code: variant.code,
			option: variant.option,
			votes: statistics[variant.code] || 0,
		}));

		const acceptHeader = req.headers.accept;

		if (acceptHeader === 'application/json') {
			res
				.set({
					'Content-Type': 'application/json',
					'Content-Disposition': 'attachment; filename="statistics.json"',
				})
				.status(200)
				.json({
					status: 'success',
					data: stats,
				});
		} else if (acceptHeader === 'application/xml') {
			const xmlBody = toXML(stats);
			res
				.set({
					'Content-Type': 'application/xml',
					'Content-Disposition': 'attachment; filename="statistics.xml"',
				})
				.status(200)
				.send(xmlBody);
		} else {
			const htmlBody = toHTML(stats, ['option', 'votes']);
			res
				.set({
					'Content-Type': 'text/html',
					'Content-Disposition': 'attachment; filename="statistics.html"',
				})
				.status(200)
				.send(htmlBody);
		}
	}),
);

webserver.post(
	'/api/v1/vote',
	catchAsync(async (req, res, next) => {
		const { code } = req.body;
		if (!code) return next(new AppError('Code was not provided!', 400));
		const statistics = await loadStatistics(statFilePath);
		if (!statistics)
			return next(new AppError('Statistics were not provided!', 400));
		if (statistics[code] !== undefined) {
			statistics[code]++;
			await saveStatistics(statistics, statFilePath);

			const stats = variants.map((variant) => ({
				code: variant.code,
				option: variant.option,
				votes: statistics[variant.code] || 0,
			}));

			const totalVotes = stats.reduce((acc, curr) => acc + curr.votes, 0);

			res
				.set({
					'Content-Type': 'application/json',
				})
				.status(200)
				.json({
					status: 'success',
					message: 'Vote Accepted!😊',
					data: {
						votedData: stats.find((stat) => stat.code === +code),
						totalVotes,
					},
				});
		} else {
			res
				.set({
					'Content-Type': 'application/json',
				})
				.status(400)
				.json({
					status: 'error',
					message: 'Vote Not Accepted! Please Try Again Later!😉',
				});
		}
	}),
);

webserver.get(
	'/',
	catchAsync(async (req, res, next) => {
		if (!variants)
			return next(new AppError('Variants were not provided!', 400));
		res.render('voting', { variants });
	}),
);

webserver.get(
	'/results',
	catchAsync(async (req, res, next) => {
		const { votedOption } = req.query;
		if (!votedOption)
			return next(
				new AppError('Vote Not Accepted! Please Try Again Later!😉', 400),
			);
		res.render('results', { votedOption });
	}),
);

webserver.get('/statistics', (req, res, next) => {
	res.render('statistics');
});

// 404 error
webserver.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

webserver.use(globalErrorHandler);

webserver.listen(port, () => {
	const logLine = `Web server running on port  ${port}, process.pid = ${process.pid}`;
	// console.log(process.env.NODE_ENV);
	logLineAsync(logFilePath, logLine);
});

process.on('unhandledRejection', (err) => {
	const logLine = `UNHANDLED REJECTION!💥 Shutting down... ${err.name}: ${err.message}`;
	logLineSync(logFilePath, logLine);
	process.exit(1);
});
