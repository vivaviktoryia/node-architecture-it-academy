const express = require('express');

const webserver = express();

webserver.use(express.urlencoded({ extended: true }));

const port = 7122;

webserver.get('/service1', (req, res) => {
	console.log('service1 called');
	console.log(
		`Full URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`,
	);
	console.log(`host: ${req.get('host')}`);
	console.log(`originalUrl: ${req.originalUrl}`);
	res.send('service1 ok!');
});

webserver.listen(port, () => {
	console.log('web server running on port ' + port);
});
