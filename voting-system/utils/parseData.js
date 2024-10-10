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


function toHTML(stats) {
	let html = '<ul>';
	stats.forEach((stat) => {
		html += `<li>${stat.option}: ${stat.votes} votes</li>`;
	});
	html += '</ul>';
	return html;
}

module.exports = {
	toXML,
	toHTML,
};
