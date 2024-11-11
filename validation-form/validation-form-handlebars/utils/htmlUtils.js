function escapeHtml(text) {
	if (!text) return text;
	text = text
		.toString()
		.split('&')
		.join('&amp;')
		.split('<')
		.join('&lt;')
		.split('>')
		.join('&gt;')
		.split('"')
		.join('&quot;')
		.split("'")
		.join('&#039;');
	return text;
}

function removeHtml(text) {
	if (!text) return text;
	text = text
		.toString()
		.replaceAll('&', '')
		.replaceAll('<', '')
		.replaceAll('>', '')
		.replaceAll('"', '')
		.replaceAll("'", '');
	return text;
}


module.exports = {
	escapeHtml,
	removeHtml,
};
