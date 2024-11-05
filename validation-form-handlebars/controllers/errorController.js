const handleNotFound = async (req, res, next) => {
	const statusCode = 404;
	const errorMessage = `Can't find ${req.originalUrl} on this server!`;

	try {
		res.status(statusCode).render('error', {
			layout: 'main',
			title: `Error ${statusCode}`,
			statusCode,
			errorMessage,
			emoji: '😢 🤯',
		});
	} catch (error) {
		res.status(500).send('Internal Server Error');
	}
};

module.exports = {
	handleNotFound,
};
