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

function composeForm(values, errors) {
	let errorMessage = '';

	if (Array.isArray(errors)) {
		errorMessage = errors?.map((err) => err.msg).join(', ');
	} else if (typeof errors === 'object' && errors !== null) {
		errorMessage = errors
			?.array()
			.map((err) => err.msg)
			.join(', ');
	}
	return `
		    <h1>Please Fill Out the Form</h1>
            <div class="form-container">
                ${
									errorMessage
										? `<p style="color: red;">${errorMessage}</p>`
										: ''
								}
                <form method="post" action="/submit">
                    <label for="name">Name:</label>
                    <input type="text" placeholder="Enter your name" name="name" value="${
											values.name || ''
										}">
                    <br>
                    <label for="email">Email:</label>
                    <input type="email"  placeholder="Enter your email" name="email" value="${
											values.email || ''
										}">
                    <br>
                    <input type="submit" value="Submit">
                </form>
            </div>
        `;
}

function composeSuccess(values) {
	return `
        <h1>Form Submitted Successfully!</h1>
        <ul>
          <li>Name: ${values.name}</li>
          <li>Email: ${values.email}</li>
        </ul>
        <a href="/">Go Back to Form</a>
      `;
}

module.exports = {
	renderHtml,
	escapeHtml,
	removeHtml,
	composeForm,
	composeSuccess,
};
