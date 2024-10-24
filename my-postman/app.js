const dotenv = require('dotenv');
const express = require('express');
const path = require('path');

dotenv.config({ path: `${__dirname}/config.env` });

const {
	logLineSync,
	logLineAsync,
	loggerMiddleware,
} = require('./utils/logger');

const logFileName = '_server.log';
const logFilePath = path.resolve('logs', logFileName);

const webserver = express();
const port = process.env.PORT || 7181;

webserver.set('view engine', 'pug');
webserver.set('views', path.join(__dirname, 'views'));

// Request Body Parser
webserver.use(express.json({ limit: '10kb' })); // content-type: application/json -> JSON.parse(req.body)
webserver.use(express.urlencoded({ extended: true, limit: '10kb' })); // content-type: application/x-www-form-urlencoded

webserver.use(loggerMiddleware);

webserver.use(express.static(path.join(__dirname, 'public')));

process.on('uncaughtException', (err) => {
	const logLine = `UNCAUGHT EXCEPTION!💥 Shutting down... ${err.name}: ${err.message}`;
	logLineSync(logFilePath, logLine);
	process.exit(1);
});

// webserver.get('/', (req, res, next) => {
// 	res.status(200).render('base');
// 	// .send('<h1> Hi! From MyPostman! </h1>');
// });

webserver.get('/', (req, res) => {
	res.render('base', { response: null });
});

webserver.post('/request', async (req, res) => {
	const { url, method, headers, query, bodyFormat, body } = req.body;

	// Формирование query параметров
	let urlWithQuery = url;
	if (query) {
		const queryParams = query
			.map((param) => `${param.key}=${encodeURIComponent(param.value)}`)
			.join('&');
		urlWithQuery += `?${queryParams}`;
	}

	// Парсинг заголовков
	const parsedHeaders = headers ? headers : {};

	// Опции для запроса
	const options = {
		method,
		headers: parsedHeaders,
	};

	// Обработка разных типов тела запроса
	if (['POST', 'PUT'].includes(method)) {
		if (bodyFormat === 'json') {
			options.body = body;
		} else if (bodyFormat === 'urlencoded') {
			options.body = new URLSearchParams(body).toString();
			options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
		} else if (bodyFormat === 'formdata') {
			const formData = new FormData();
			Object.entries(req.body.formdata).forEach(([key, value]) => {
				formData.append(key, value);
			});
			options.body = formData;
		}
	}

	try {
		const response = await fetch(urlWithQuery, options);
		const responseBody = await response.text();

		// Отправка результата на клиент
		res.render('base', {
			response: {
				status: response.status,
				headers: JSON.stringify([...response.headers.entries()], null, 2),
				body: responseBody,
			},
		});
	} catch (error) {
		res.render('base', { response: { error: error.message } });
	}
});


// 404 error
webserver.all('*', (req, res, next) => {
	const errorMsg = `Can't find ${req.originalUrl} on this server!`;
	res.status(404).send(errorMsg);
});

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
