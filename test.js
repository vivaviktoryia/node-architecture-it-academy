const express = require('express');
const path = require('path');
const fileName = 'results.txt';

const webserver = express();

// Body parser
webserver.use(express.json({ limit: '10kb' })); // content-type: application/json
webserver.use(express.urlencoded({ extended: true, limit: '10kb' })); // content-type: application/x-www-form-urlencoded

const port = 7180 || 7181;

webserver.get('/service1', (req, res, next) => {
	console.log(`${req.originalUrl} called`);
	console.log(
		`Full URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`,
	);
	console.log(`host: ${req.get('host')}`);
	console.log(`originalUrl: ${req.originalUrl}`);
	res.send(
		`service1 ok! Full URL: ${req.protocol}://${req.get('host')}${
			req.originalUrl
		}`,
	);
});

// req.query - query params
webserver.get('/service2', (req, res, next) => {
	console.log(`${req.originalUrl} called`);
	// res.send(`service2 ok, par1= ${req.query.par1}  par2= ${req.query.par2}`);
	res.send(`service2 ok, req.query= ${JSON.stringify(req.query)} `);
});

// req.params - path variables
webserver.get('/service2b/:par1/:par2', (req, res, next) => {
	console.log(`${req.originalUrl} called`);
	// res.send(`service2b ok, par1= ${req.params.par1}  par2= ${req.params.par2}`);
	res.send(`service2b ok, req.params= ${JSON.stringify(req.params)} `);
});

// work with file
webserver.get('/service7', (req, res, next) => {
	console.log(`${req.originalUrl} called`);
	res.sendFile(path.resolve(__dirname, fileName));
});

webserver.post('/service6', (req, res, next) => {
	console.log(`${req.originalUrl} called`);
	console.log(req.body);
	res.send(`service6 ok, req.body= ${JSON.stringify(req.body)} `);
});

// 404 error
webserver.use('*', (req, res, next) => {
	res.status(404).send(`Can't find ${req.originalUrl} on this server!`);
});

webserver.listen(port, () => {
	console.log('web server running on port ' + port);
});
