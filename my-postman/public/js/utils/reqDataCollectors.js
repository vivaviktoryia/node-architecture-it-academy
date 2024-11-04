import { displayPopup } from './popup.js';

export const collectUrl = (urlInputEl, paramsContainerEl) => {
	const baseUrl = urlInputEl.value.trim();
	if (!baseUrl) {
		displayPopup('error', 'URL cannot be empty.');
		return null;
	}

	const url = new URL(baseUrl);
	Array.from(paramsContainerEl.children).forEach((paramDiv) => {
		const key = paramDiv.querySelector('input[name="queryParams[key]"]').value;
		const value = paramDiv.querySelector(
			'input[name="queryParams[value]"]',
		).value;
		if (key && value) {
			url.searchParams.append(key, value);
		}
	});
	return url.href;
};

export const collectMethod = (selectedMethodEl) => {
	return selectedMethodEl.value;
};

export const collectHeaders = () => {
	return Array.from(document.querySelectorAll('.header-row')).reduce(
		(acc, row) => {
			const headerType = row.querySelector('select[name="headerType"]').value;
			const headerValue = row.querySelector('select[name="headerValue"]').value;
			if (headerType && headerValue) {
				acc[headerType] = headerValue;
			}
			return acc;
		},
		{},
	);
};

export const collectBody = (contentTypeEl, requestBodyEl) => {
	const requestBodyContentTypeValue = contentTypeEl.value;
	const trimmedBody = requestBodyEl.value.trim();

	if (requestBodyContentTypeValue === 'application/json') {
		if (trimmedBody === '') return {};
		try {
			return JSON.parse(trimmedBody);
		} catch (error) {
			displayPopup('error', `Invalid JSON format: ${error}`);
			console.error('Invalid JSON format:', error);
			return;
		}
	}

	if (requestBodyContentTypeValue === 'application/x-www-form-urlencoded') {
		const params = new URLSearchParams();
		const requestBodyLines = trimmedBody.split('\n');
		requestBodyLines.forEach((line) => {
			const [key, value] = line.split('=');
			if (key && value) params.append(key.trim(), value.trim());
		});
		return params.toString();
	}

	if (
		requestBodyContentTypeValue === 'text/plain' ||
		requestBodyContentTypeValue === 'text/html'
	) {
		return requestBodyEl.value;
	}

	if (requestBodyContentTypeValue === 'application/xml') {
		if (trimmedBody === '') return '';
		try {
			const parser = new DOMParser();
			const xmlDoc = parser.parseFromString(trimmedBody, 'application/xml');
			if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
				throw new Error('Invalid XML format');
			}
			return trimmedBody;
		} catch (error) {
			displayPopup('error', `Invalid XML format: ${error}`);
			console.error('Invalid XML format:', error);
			return;
		}
	}
};

export const collectValidatedRequestData = (
	urlInputEl,
	paramsContainerEl,
	selectedMethodEl,
	requestBodyContentTypeEl,
	requestBodyEl,
) => {
	return {
		url: collectUrl(urlInputEl, paramsContainerEl),
		method: collectMethod(selectedMethodEl),
		headers: collectHeaders(),
		body: collectBody(requestBodyContentTypeEl, requestBodyEl),
	};
};
