const hidePopup = () => {
	const el = document.querySelector('.popup');
	if (el) el.parentElement.removeChild(el);
};

const displayPopup = (type, msg) => {
	hidePopup();
	const markup = `<div class="popup popup--${type}">${msg}</div>`;
	document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
	window.setTimeout(hidePopup, 5000);
};

document.addEventListener('DOMContentLoaded', () => {
	// REQUEST
	const requestForm = document.getElementById('requestForm');
	const selectedMethod = document.getElementById('selectedMethod');
	const urlInput = document.querySelector('input[name="url"]');

	const addParamButton = document.getElementById('add-param');
	const paramsContainer = document.getElementById('params-container');
	const addHeaderButton = document.getElementById('add-header');
	const requestHeaders = document.getElementById('dynamic-headers-container');
	const requestBodyContentType = document.getElementById(
		'requestBodyContentType',
	);
	const requestBody = document.getElementById('requestBody');

	// RESPONSE
	const responseContainer = document.querySelector('.response-container');
	const responseMessage = document.getElementById('responseMessage');
	const statusElement = document.getElementById('status');
	const statusTextElement = document.getElementById('statusText');

	const tabBody = document.getElementById('tabBody');
	const bodyTabContent = document.getElementById('bodyTab');
	const tabHeader = document.getElementById('tabHeader');
	const headersTabContent = document.getElementById('headersTab');

	const responseHeadersTable = document.getElementById('responseHeaders');
	const responseBody = document.getElementById('responseBody');

	const selectedHeaders = new Set();

	addParamButton.addEventListener('click', () => {
		const paramDiv = document.createElement('div');
		paramDiv.innerHTML = `
            <input type="text" name="queryParams[key]" placeholder="Key" required>
            <input type="text" name="queryParams[value]" placeholder="Value" required>
            <button type="button" onclick="this.parentNode.remove()">Remove</button>
        `;
		paramsContainer.appendChild(paramDiv);
	});

	addHeaderButton.addEventListener('click', () => {
		const headerDiv = document.createElement('div');
		headerDiv.className = 'header-row';

		const headerSelect = document.createElement('select');
		headerSelect.name = 'headerType';
		headerSelect.className = 'header-dropdown';
		headerSelect.innerHTML = `
            <option value="">Select Header</option>
            <option value="accept">Accept</option>
            <option value="content-type">Content-Type</option>
            <option value="accept-encoding">Accept-Encoding</option>
        `;

		const headerValueSelect = document.createElement('select');
		headerValueSelect.name = 'headerValue';
		headerValueSelect.className = 'header-dropdown';
		headerValueSelect.innerHTML = `<option value="">Select Value</option>`;

		headerSelect.addEventListener('change', function () {
			headerValueSelect.innerHTML = '';
			addHeaderOptions(headerValueSelect, this.value);

			if (this.value) {
				selectedHeaders.add(this.value);
			}

			updateHeaderOptions();
		});

		headerDiv.appendChild(headerSelect);
		headerDiv.appendChild(headerValueSelect);
		headerDiv.appendChild(
			createRemoveButton(() => {
				selectedHeaders.delete(headerSelect.value);
				headerDiv.remove();
				updateHeaderOptions();
			}),
		);

		requestHeaders.appendChild(headerDiv);
		updateHeaderOptions();
	});

	function createRemoveButton(removeCallback) {
		const button = document.createElement('button');
		button.type = 'button';
		button.textContent = 'Remove';
		button.onclick = removeCallback;
		return button;
	}

	function addHeaderOptions(select, headerType) {
		const options = {
			accept: [
				{ value: 'text/html', text: 'text/html' },
				{ value: 'text/plain', text: 'text/plain' },
				{ value: 'application/xml', text: 'application/xml' },
				{ value: 'application/json', text: 'application/json' },
				{ value: 'image/*', text: 'image/*' },
				{ value: '*/*', text: '*/*' },
			],
			'content-type': [
				{ value: 'text/html', text: 'text/html' },
				{ value: 'text/plain', text: 'text/plain' },
				{ value: 'application/xml', text: 'application/xml' },
				{ value: 'application/json', text: 'application/json' },
				{
					value: 'application/x-www-form-urlencoded',
					text: 'application/x-www-form-urlencoded',
				},
				{ value: 'multipart/form-data', text: 'multipart/form-data' },
			],
			'accept-encoding': [
				{ value: 'gzip', text: 'gzip' },
				{ value: 'deflate', text: 'deflate' },
				{ value: 'br', text: 'br' },
				{ value: 'gzip, deflate, br', text: 'gzip,deflate,br' },
				{ value: '*', text: '*' },
			],
		};

		options[headerType]?.forEach((option) => {
			const opt = document.createElement('option');
			opt.value = option.value;
			opt.textContent = option.text;
			select.appendChild(opt);
		});
	}

	function updateHeaderOptions() {
		const headerSelects = document.querySelectorAll(
			'.header-dropdown[name="headerType"]',
		);
		headerSelects.forEach((select) => {
			const currentSelectedValue = select.value;

			Array.from(select.options).forEach((option) => {
				option.disabled = false;
			});

			selectedHeaders.forEach((header) => {
				if (header && header !== currentSelectedValue) {
					const option = select.querySelector(`option[value="${header}"]`);
					if (option) {
						option.disabled = true;
					}
				}
			});
		});
	}

	function showTabContent(tabName) {
		if (tabName === 'Body') {
			bodyTabContent.style.display = 'block';
			headersTabContent.style.display = 'none';
			tabBody.classList.add('active');
			tabHeader.classList.remove('active');
		} else {
			bodyTabContent.style.display = 'none';
			headersTabContent.style.display = 'block';
			tabHeader.classList.add('active');
			tabBody.classList.remove('active');
		}
	}

	tabBody.addEventListener('click', () => showTabContent('Body'));
	tabHeader.addEventListener('click', () => showTabContent('Headers'));

	requestForm.addEventListener('submit', async (event) => {
		event.preventDefault();

		responseContainer.style.display = 'none';
		responseMessage.style.display = 'block';
		statusElement.innerText = 'No Status';
		statusTextElement.innerText = '';
		responseHeadersTable.innerHTML = '';
		responseBody.innerText = 'No Body';

		// URL
		const baseUrl = urlInput.value;
		const url = new URL(baseUrl);
		Array.from(paramsContainer.children).forEach((paramDiv) => {
			const key = paramDiv.querySelector(
				'input[name="queryParams[key]"]',
			).value;
			const value = paramDiv.querySelector(
				'input[name="queryParams[value]"]',
			).value;
			if (key && value) {
				url.searchParams.append(key, value);
			}
		});

		// METHOD
		const method = selectedMethod.value;

		// HEADERS
		const headers = Array.from(document.querySelectorAll('.header-row')).reduce(
			(acc, row) => {
				const headerType = row.querySelector('select[name="headerType"]').value;
				const headerValue = row.querySelector(
					'select[name="headerValue"]',
				).value;
				if (headerType && headerValue) {
					acc[headerType] = headerValue;
				}
				return acc;
			},
			{},
		);

		// BODY
		const requestBodyContentTypeValue = requestBodyContentType.value;
		let body;

		if (requestBodyContentTypeValue === 'application/json') {
			const trimmedBody = requestBody.value.trim();
			if (trimmedBody === '') {
				body = {};
			} else {
				try {
					body = JSON.parse(trimmedBody);
				} catch (error) {
					displayPopup('error', `Invalid JSON format: ${error}`);
					console.error('Invalid JSON format:', error);
					return;
				}
			}
		} else if (
			requestBodyContentTypeValue === 'application/x-www-form-urlencoded'
		) {
			const params = new URLSearchParams();
			const requestBodyLines = requestBody.value.split('\n');
			requestBodyLines.forEach((line) => {
				const [key, value] = line.split('=');
				if (key && value) {
					params.append(key.trim(), value.trim());
				}
			});
			body = params.toString();
		} else if (
			requestBodyContentTypeValue === 'text/plain' ||
			requestBodyContentTypeValue === 'text/html'
		) {
			body = requestBody.value;
		} else if (requestBodyContentTypeValue === 'application/xml') {
			const trimmedBody = requestBody.value.trim();
			if (trimmedBody === '') {
				body = '';
			} else {
				try {
					const parser = new DOMParser();
					const xmlDoc = parser.parseFromString(trimmedBody, 'application/xml');
					const parseError = xmlDoc.getElementsByTagName('parsererror');
					if (parseError.length > 0) {
						throw new Error('Invalid XML format');
					}

					body = trimmedBody;
				} catch (error) {
					displayPopup('error', `Invalid XML format: ${error}`);
					console.error('Invalid XML format:', error);
					return;
				}
			}
		}

		try {
			const response = await fetch('/request', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					url: url.href,
					method,
					headers,
					body,
				}),
			});

			const responseData = await response.json();
			const status = responseData.status;
			statusElement.innerText = responseData.status || 'No Status';
			statusTextElement.innerText = responseData.statusText || '';

			if (status) {
				if (status >= 200 && status < 300) {
					statusElement.className = 'status-green';
					statusTextElement.className = 'status-green';
				} else if (status >= 300 && status < 400) {
					statusElement.className = 'status-blue';
					statusTextElement.className = 'status-blue';
				} else if (status >= 400 && status < 600) {
					statusElement.className = 'status-red';
					statusTextElement.className = 'status-red';
				} else {
					statusElement.className = 'status-black';
					statusTextElement.className = 'status-black';
				}
			}

			responseHeadersTable.innerHTML = '';
			Object.entries(responseData.headers || {}).forEach(([key, value]) => {
				const row = document.createElement('tr');
				const keyCell = document.createElement('td');
				const valueCell = document.createElement('td');
				keyCell.innerText = key;
				valueCell.innerText = value;
				row.appendChild(keyCell);
				row.appendChild(valueCell);
				responseHeadersTable.appendChild(row);
			});

			responseBody.innerText =
				JSON.stringify(responseData.data, null, 2) || 'No Body';

			responseContainer.style.display = 'block';
			responseMessage.style.display = 'none';
		} catch (error) {
			console.error('Error:', error);
			statusElement.innerText = 'Error';
			responseBody.innerText = `Error occurred: ${error.message}`;
			responseContainer.style.display = 'block';
			responseMessage.style.display = 'none';
		}
	});
});
