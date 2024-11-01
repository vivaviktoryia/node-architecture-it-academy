import { displayPopup } from './popup.js';
import { collectValidatedRequestData } from './reqDataCollectors.js';

export async function sendRequest(
	urlInput,
	paramsContainer,
	selectedMethod,
	requestBodyContentType,
	requestBody,
) {
	const requestData = collectValidatedRequestData(
		urlInput,
		paramsContainer,
		selectedMethod,
		requestBodyContentType,
		requestBody,
	);
	if (!requestData) {
		displayPopup('error', `Smth went wrong!🤯 ${error}`);
		return { responseData: null, error: new Error('Invalid request data') };
	}
	try {
		const response = await fetch('/api/v1/request/review', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(requestData),
		});

		const responseData = await response.json();
		return { responseData, error: null };
		
	} catch (error) {
		console.error('Error:', error);
		 return { responseData: null, error };
	}
}

export function renderResponse(
	responseData,
	responseContainer,
	responseMessage,
	statusElement,
	statusTextElement,
	responseHeadersTable,
	responseBody,
) {
	const { status, statusText, headers, data } = responseData;

	updateStatusElements(status, statusText, statusElement, statusTextElement);
	populateHeaders(headers, responseHeadersTable);
	populateBody(data, responseBody, responseContainer, responseMessage);
}

function updateStatusElements(
	status,
	statusText,
	statusElement,
	statusTextElement,
) {
	statusElement.innerText = status || 'No Status';
	statusTextElement.innerText = statusText || '';

	if (status) {
		if (status >= 200 && status < 300) {
			setStatusClass('status-green', statusElement, statusTextElement);
		} else if (status >= 300 && status < 400) {
			setStatusClass('status-blue', statusElement, statusTextElement);
		} else if (status >= 400 && status < 600) {
			setStatusClass('status-red', statusElement, statusTextElement);
		} else {
			setStatusClass('status-black', statusElement, statusTextElement);
		}
	}
}

function setStatusClass(className, statusElement, statusTextElement) {
	statusElement.className = className;
	statusTextElement.className = className;
}

function populateHeaders(headers, responseHeadersTable) {
	responseHeadersTable.innerHTML = '';
	Object.entries(headers || {}).forEach(([key, value]) => {
		const row = document.createElement('tr');
		const keyCell = document.createElement('td');
		const valueCell = document.createElement('td');
		keyCell.innerText = key;
		valueCell.innerText = value;
		row.appendChild(keyCell);
		row.appendChild(valueCell);
		responseHeadersTable.appendChild(row);
	});
}
function populateBody(data, responseBody, responseContainer, responseMessage) {
	responseBody.innerText = JSON.stringify(data, null, 2) || 'No Body';

	responseContainer.style.display = 'block';
	responseMessage.style.display = 'none';
}

export function handleError(
	error,
	responseContainer,
	responseMessage,
	statusElement,
	responseBody,
) {
	console.error('Error:', error);
	responseContainer.style.display = 'block';
	responseMessage.style.display = 'none';
	statusElement.innerText = 'Error';
	responseBody.innerText = `Error occurred: ${error.message}`;
}

export function clearResponse(
	responseContainer,
	responseMessage,
	statusElement,
	statusTextElement,
	responseHeadersTable,
	responseBody,
) {
	responseContainer.style.display = 'none';
	responseMessage.style.display = 'block';
	responseHeadersTable.innerHTML = '';
	responseBody.innerText = 'No Body';
	statusElement.innerText = 'No Status';
	statusTextElement.innerText = '';
}

export function clearForm(
	requestForm,
	paramsContainer,
	headersContainer,
	responseContainer,
	responseMessage,
	statusElement,
	statusTextElement,
	responseHeadersTable,
	responseBody,
) {
	requestForm.reset();
	paramsContainer.innerHTML = '';
	headersContainer.innerHTML = '';
	clearResponse(
		responseContainer,
		responseMessage,
		statusElement,
		statusTextElement,
		responseHeadersTable,
		responseBody,
	);
	displayPopup('success', 'Form cleared successfully!');
}


export async function saveRequest(
	urlInput,
	paramsContainer,
	selectedMethod,
	requestBodyContentType,
	requestBody,
) {
	const requestData = collectValidatedRequestData(
		urlInput,
		paramsContainer,
		selectedMethod,
		requestBodyContentType,
		requestBody,
	);
	if (!requestData) {
		displayPopup('error', 'Smth went wrong during saving!!!!!!🤯');
		return;
	}

	try {
		const response = await fetch('/api/v1/requests', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(requestData),
		});

		if (response.ok) {
			displayPopup('success', 'Request saved successfully!');
		} else {
			const errorResponse = await response.json();
			displayPopup('error', `Failed to save request: ${errorResponse.message}`);
		}
	} catch (error) {
		console.error('Error saving request:', error);
		displayPopup(
			'error',
			`Error occurred while saving request: ${error.message}`,
		);
	}
}
