document.addEventListener('DOMContentLoaded', function () {
	// Function to align the selected method with the URL input
	function alignMethodWithUrl() {
		const methodSelect = document.getElementById('method-select');
		const urlInput = document.querySelector('.url-input');

		// Set the margin of the URL input based on the selected method
		const selectedMethod =
			methodSelect.options[methodSelect.selectedIndex].text;
		urlInput.style.marginLeft = selectedMethod.length > 3 ? '0' : '10px';
	}

	// Event listener for method select change
	const methodSelect = document.getElementById('method-select');
	if (methodSelect) {
		methodSelect.addEventListener('change', alignMethodWithUrl);
	}

	// Event listener for body format select change
	const bodyFormatSelect = document.getElementById('bodyFormat');
	if (bodyFormatSelect) {
		bodyFormatSelect.addEventListener('change', function () {
			toggleBodyFormat(this.value);
		});
	}

	// Initialize body format and align method with URL on page load
	toggleBodyFormat(bodyFormatSelect.value);
	alignMethodWithUrl(); // Ensure this is called to set initial state

	// Logic to dynamically add headers
	document
		.querySelector('.add-header-btn')
		.addEventListener('click', function () {
			const headersContainer = document.getElementById('headersContainer');
			const newHeaderDiv = document.createElement('div');
			newHeaderDiv.classList.add('header-row');

			// Dropdown for header selection
			const headerSelect = document.createElement('select');
			headerSelect.name = 'headers[header]';

			// Options for headers
			const headerOptions = ['Accept', 'Content-Type', 'Accept-Encoding'];

			headerOptions.forEach((header) => {
				const option = document.createElement('option');
				option.value = header;
				option.textContent = header;
				headerSelect.appendChild(option);
			});

			// Input for header value
			const valueInput = document.createElement('input');
			valueInput.type = 'text';
			valueInput.placeholder = 'Header Value';
			valueInput.name = `headers[${headerSelect.value}]`;

			// Update value input when header is selected
			headerSelect.addEventListener('change', function () {
				valueInput.name = `headers[${this.value}]`;
				valueInput.value = ''; // Clear previous value
				switch (this.value) {
					case 'Accept':
						valueInput.value = 'application/json';
						break;
					case 'Content-Type':
						valueInput.value = 'application/json';
						break;
					case 'Accept-Encoding':
						valueInput.value = 'gzip';
						break;
					default:
						valueInput.value = '';
				}
			});

			newHeaderDiv.appendChild(headerSelect);
			newHeaderDiv.appendChild(valueInput);
			headersContainer.appendChild(newHeaderDiv);
		});

	// Logic to dynamically add query parameters
	document
		.querySelector('.add-query-btn')
		.addEventListener('click', function () {
			const queryParamsContainer = document.getElementById(
				'queryParamsContainer',
			);
			const newQueryParamDiv = document.createElement('div');
			newQueryParamDiv.classList.add('query-param-row');

			// Input for query key
			const queryKeyInput = document.createElement('input');
			queryKeyInput.type = 'text';
			queryKeyInput.placeholder = 'Query Key';
			queryKeyInput.name = 'queryKey[]';

			// Input for query value
			const queryValueInput = document.createElement('input');
			queryValueInput.type = 'text';
			queryValueInput.placeholder = 'Query Value';
			queryValueInput.name = 'queryValue[]';

			newQueryParamDiv.appendChild(queryKeyInput);
			newQueryParamDiv.appendChild(queryValueInput);
			queryParamsContainer.appendChild(newQueryParamDiv);
		});

	// Function to toggle body format
	function toggleBodyFormat(format) {
		const bodyJsonDiv = document.getElementById('bodyJson');
		const bodyFormdataDiv = document.getElementById('formDataFields');

		// Hide all body formats initially
		bodyJsonDiv.style.display = 'none';
		bodyFormdataDiv.innerHTML = ''; // Clear previous form data fields

		// Show the selected body format
		if (format === 'json') {
			bodyJsonDiv.style.display = 'block';
		} else if (format === 'formdata') {
			addFormDataField(); // Add a default form data field
		}
	}

	// Function to add a new form data field
	function addFormDataField() {
		const formDataFieldsDiv = document.getElementById('formDataFields');

		const newFormDataFieldDiv = document.createElement('div');
		newFormDataFieldDiv.classList.add('form-data-field');

		const keyInput = document.createElement('input');
		keyInput.type = 'text';
		keyInput.name = 'formDataKey[]'; // Allow multiple form data keys
		keyInput.placeholder = 'Form Data Key';

		const valueInput = document.createElement('input');
		valueInput.type = 'text';
		valueInput.name = 'formDataValue[]';
		valueInput.placeholder = 'Form Data Value';

		newFormDataFieldDiv.appendChild(keyInput);
		newFormDataFieldDiv.appendChild(valueInput);
		formDataFieldsDiv.appendChild(newFormDataFieldDiv);
	}
});
