// ADD HEADERS
const selectedHeaders = new Set();

export function addHeader(requestHeaders) {
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

// REMOVE BUTTON
function createRemoveButton(removeCallback) {
	const button = document.createElement('button');
	button.type = 'button';
	button.textContent = 'Remove';
	button.onclick = removeCallback;
	return button;
}
