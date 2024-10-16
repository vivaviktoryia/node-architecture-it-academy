const getHeaderByFormat = (format) => {
	const headers = {
		json: 'application/json',
		xml: 'application/xml',
		html: 'text/html',
	};

	const sanitizedFormat = format.toLowerCase().trim();
	if (!headers[sanitizedFormat]) {
		throw new Error('Invalid format🤯');
	}

	return headers[sanitizedFormat];
};

module.exports = {
	getHeaderByFormat,
};
