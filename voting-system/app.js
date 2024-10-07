const express = require('express');
const path = require('path');
const xss = require('xss-clean'); // Data sanitization - XSS

const {
	logLineSync,
	logLineAsync,
	loggerMiddleware,
} = require('./utils/logger');

const { loadStatistics, saveStatistics } = require('./utils/statistics');
const { catchAsync } = require('./utils/catchAsync');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./utils/globalErrorHandler');

const statFileName = 'statisticResults.txt';
const statFilePath = path.resolve('data', statFileName);
const logFileName = '_server.log';
const logFilePath = path.resolve('logs', logFileName);
const variants = require('./data/variants');

const webserver = express();
const port = 7180 || 7181;

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
	'/variants',
	catchAsync(async (req, res, next) => {
		if (!variants)
			return next(new AppError('Variants were not provided!', 400));
		res.status(200).json({
			status: 'success',
			data: {
				data: variants,
			},
		});
	}),
);

webserver.post(
	'/stat',
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
		res.status(200).json({
			status: 'success',
			data: {
				data: stats,
			},
		});
	}),
);

webserver.post(
	'/vote',
	catchAsync(async (req, res, next) => {
		const { code } = req.body;
		if (!code) return next(new AppError('Code was not provided!', 400));
		const statistics = await loadStatistics(statFilePath);
		if (!statistics)
			return next(new AppError('statistics were not provided!', 400));
		if (statistics[code] !== undefined) {
			statistics[code]++;
			await saveStatistics(statistics, statFilePath);

			const stats = variants.map((variant) => ({
				option: variant.option,
				votes: statistics[variant.code] || 0,
			}));

			res.status(200).json({
				status: 'success',
				message: 'Vote Accepted!😊',
				data: {
					data: stats,
				},
			});
		} else {
			res.status(400).json({
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
	'/statistics',
	catchAsync(async (req, res, next) => {
		const statistics = await loadStatistics(statFilePath);
		if (!statistics || !variants)
			return next(
				new AppError('Statistics or variants were not provided!', 400),
			);
		const stats = variants.map((variant) => ({
			option: variant.option,
			votes: statistics[variant.code] || 0,
		}));
		res.render('statistics', { stats });
	}),
);

// 404 error
webserver.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

webserver.use(globalErrorHandler);

webserver.listen(port, '127.0.0.2', () => {
	const logLine = `Web server running on port  ${port}, process.pid = ${process.pid}`;
	console.log(process.env.NODE_ENV);
	logLineAsync(logFilePath, logLine);
});

process.on('unhandledRejection', (err) => {
	const logLine = `UNHANDLED REJECTION!💥 Shutting down... ${err.name}: ${err.message}`;
	logLineSync(logFilePath, logLine);
	process.exit(1);
});
