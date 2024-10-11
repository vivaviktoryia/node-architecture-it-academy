function toXML(stats) {
	let xml = '<variants>';
	stats.forEach((stat) => {
		xml += `<variant>
                    <code>${stat.code}</code>
                    <option>${stat.option}</option>
                    <votes>${stat.votes}</votes>
                </variant>`;
	});
	xml += '</variants>';
	return xml;
}


// function toHTML(stats) {
// 	let html = '<ul>';
// 	stats.forEach((stat) => {
// 		html += `<li>${stat.option}: ${stat.votes} votes</li>`;
// 	});
// 	html += '</ul>';
// 	return html;
// }

function toHTML(data, keysToShow = []) {
	let html = '';

	if (Array.isArray(data)) {
		html += '<ul>';
		data.forEach((item) => {
			if (keysToShow.length > 0 && keysToShow.every((key) => key in item)) {
				const formattedItem =
					keysToShow.map((key) => item[key]).join(': ') + ' votes';
				html += `<li>${formattedItem}</li>`;
			} else {
				html += `<li>${toHTML(item, keysToShow)}</li>`;
			}
		});
		html += '</ul>';
	} else if (typeof data === 'object' && data !== null) {
		if (keysToShow.length > 0 && keysToShow.every((key) => key in data)) {
			const formattedItem =
				keysToShow.map((key) => data[key]).join(': ') + ' votes';
			html += `<li>${formattedItem}</li>`;
		} else {
			html += '<ul>';
			for (const [key, value] of Object.entries(data)) {
				html += `<li>${key}: ${toHTML(value, keysToShow)}</li>`;
			}
			html += '</ul>';
		}
	} else {
		html += `${data}`;
	}

	return html;
}

module.exports = {
	toXML,
	toHTML,
};
