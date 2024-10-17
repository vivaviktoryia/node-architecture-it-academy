const express = require('express');
const path = require('path');
const fs = require('fs');

const { logLineSync } = require('../utils/utils');

const webserver = express();

// views
webserver.set('view engine', 'pug');
webserver.set('views', path.join(__dirname, 'views'));
webserver.use(express.static(path.join(__dirname, 'public')));

const port = 3570;
const logFN = path.join(__dirname, '_server.log');

webserver.get('/', (req, res) => {
	res.render('server3570');
});

webserver.get('/service1', (req, res) => {
	logLineSync(logFN, `[${port}] ` + 'service1 called');

	res.setHeader('Access-Control-Allow-Origin', '*'); // нужно, т.к. мы к этому сервису и через AJAX будем обращаться
	res.setHeader('Content-Type', 'text/plain; charset=UTF-8');

	var readStream = fs.createReadStream(
		path.join(__dirname, 'files/text_utf8.txt'),
	);
	readStream.pipe(res);
});

webserver.get('/service2', (req, res) => {
	logLineSync(logFN, `[${port}] ` + 'service2 called');

	res.setHeader('Access-Control-Allow-Origin', '*'); // нужно, т.к. мы к этому сервису и через AJAX будем обращаться
	res.setHeader('Content-Type', 'text/plain; charset=windows-1251');

	var readStream = fs.createReadStream(
		path.join(__dirname, 'files/text_win1251.txt'),
	);
	readStream.pipe(res);
});

webserver.get('/service3', (req, res) => {
	logLineSync(logFN, `[${port}] ` + 'service3 called');

	res.setHeader('Content-Type', 'text/plain; charset=UTF-8');

	var readStream = fs.createReadStream(
		path.join(__dirname, 'files/text_win1251.txt'),
	);
	readStream.pipe(res);
});

webserver.listen(port, () => {
	logLineSync(logFN, 'web server running on port ' + port);
});
