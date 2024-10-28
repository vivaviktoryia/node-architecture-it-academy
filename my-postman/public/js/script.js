document.addEventListener('DOMContentLoaded', () => {
	document.getElementById('add-param').addEventListener('click', () => {
		const container = document.getElementById('params-container');
		const paramDiv = document.createElement('div');
		paramDiv.innerHTML = `
            <input type="text" name="queryParams[key]" placeholder="Key" required>
            <input type="text" name="queryParams[value]" placeholder="Value" required>
            <button type="button" onclick="this.parentNode.remove()">Remove</button>
        `;
		container.appendChild(paramDiv);
	});

	const selectedHeaders = new Set();

	document.getElementById('add-header').addEventListener('click', () => {
		const headersContainer = document.getElementById(
			'dynamic-headers-container',
		);
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

		headersContainer.appendChild(headerDiv);
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
				{ value: '*', text: 'all' },
			],
		};

		options[headerType].forEach((option) => {
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

	const tabBody = document.getElementById('tabBody');
	const tabHeader = document.getElementById('tabHeader');
	const bodyTabContent = document.getElementById('bodyTab');
	const headersTabContent = document.getElementById('headersTab');
	const responseMessage = document.getElementById('responseMessage');
	const responseContainer = document.querySelector('.response-container');

	// Toggle tab content and active class
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

	document
		.getElementById('requestForm')
		.addEventListener('submit', async (event) => {
			event.preventDefault();

			// Reset response container for new request
			responseContainer.style.display = 'none';
			responseMessage.style.display = 'block';
			document.getElementById('status').innerText = 'No Status';
			document.getElementById('headers').innerHTML = '';
			document.getElementById('body').innerText = 'No Body';

			const url = document.querySelector('input[name="url"]').value;
			const method = document.getElementById('method-select').value;
			const headers = Array.from(
				document.querySelectorAll('.header-row'),
			).reduce((acc, row) => {
				const headerType = row.querySelector('select[name="headerType"]').value;
				const headerValue = row.querySelector(
					'select[name="headerValue"]',
				).value;
				if (headerType && headerValue) {
					acc[headerType] = headerValue;
				}
				return acc;
			}, {});

			const body = document.querySelector('textarea[name="body"]').value;

			try {
				const response = await fetch('/request', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ url, method, headers, body }),
				});

				const responseData = await response.json();
				console.log('!!!!!!!!!',responseData);
				document.getElementById('status').innerText =
					responseData.status || 'No Status';

				// Populate headers
				const headersTableBody = document.getElementById('headers');
				headersTableBody.innerHTML = '';
				Object.entries(responseData.headers || {}).forEach(([key, value]) => {
					const row = document.createElement('tr');
					const keyCell = document.createElement('td');
					const valueCell = document.createElement('td');
					keyCell.innerText = key;
					valueCell.innerText = value;
					row.appendChild(keyCell);
					row.appendChild(valueCell);
					headersTableBody.appendChild(row);
				});

				// Display body
				document.getElementById('body').innerText =
					JSON.stringify(responseData.data, null, 2) || 'No Body';

				// Show response container and hide initial message
				responseContainer.style.display = 'block';
				responseMessage.style.display = 'none';
			} catch (error) {
				console.error('Error:', error);
				document.getElementById('status').innerText = 'Error';
				document.getElementById(
					'body',
				).innerText = `Error occurred: ${error.message}`;
				responseContainer.style.display = 'block';
				responseMessage.style.display = 'none';
			}
		});
});
