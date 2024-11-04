const path = require('path');
const pageFilePath = path.resolve(__dirname, '..', 'public', 'form.html');

const { renderHtml } = require('../utils/htmlUtils');

const handleNotFound = async (req, res, next) => {
	const statusCode = 404;
	const errorMessage = `Can't find ${req.originalUrl} on this server!`;

	const replacements = {
		'#TITLE': `Error ${statusCode}`,
		'#CONTENT': `
            <div class="error">
                <h2 class="error__title">Uh oh! Something Went Wrong!</h2>
                <div class="error__emoji">😢 🤯</div>
                <p class="error__msg">${statusCode}: ${errorMessage}</p>
            </div>
        `,
	};

	try {
		const html = await renderHtml(replacements, pageFilePath);
		res.status(statusCode).send(html);
	} catch (error) {
		res.status(500).send('Internal Server Error');
	}
};

module.exports = {
	handleNotFound,
};
