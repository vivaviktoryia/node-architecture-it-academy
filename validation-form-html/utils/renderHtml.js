const fs = require('fs').promises;

async function renderHtml(replacements, filePath) {
	try {
		let html = await fs.readFile(filePath, 'utf-8');
		for (const key in replacements) {
			html = html.replace(new RegExp(key, 'g'), replacements[key]);
		}

		return html;
	} catch (error) {
		console.error('Error reading the HTML file:', error);
		throw error;
	}
}
module.exports = {
	renderHtml,
};
