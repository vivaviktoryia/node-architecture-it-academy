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
			displayPopup(
				'error',
				`Failed to save request: ${errorResponse.error.message}`,
			);
		}
	} catch (error) {
		console.error('Error saving request:', error);
		displayPopup(
			'error',
			`Error occurred while saving request: ${error.message}`,
		);
	}
}

export async function fetchSavedRequests() {
	try {
		const response = await fetch('/api/v1/requests');
		const responseData = await response.json();
		if (responseData.status !== 'success') {
			console.error('Failed to load saved requests');
			return {
				responseData: null,
				error: new Error('Failed to load saved requests.'),
			};
		}
		return { responseData, error: null };
	} catch (error) {
		console.error('An error occurred while fetching saved requests:', error);
		return { responseData: null, error };
	}
}

export async function deleteRequest(requestId) {
	try {
		const response = await fetch(`/api/v1/requests/${requestId}`, {
			method: 'DELETE',
		});

		if (!response.ok) {
			throw new Error('Failed to delete request');
		}
		displayPopup('success', 'Request was deleted successfully!');
		// await refreshSavedRequests(savedRequestsList);
	} catch (error) {
		console.error('Error deleting request:', error);
		displayPopup('error', 'Error deleting request:', error);
	}
}

export function addDeleteRequestListeners(savedRequestsList) {
	const deleteCrosses = savedRequestsList.querySelectorAll('.delete-cross');
	deleteCrosses.forEach((cross) => {
		cross.addEventListener('click', async (event) => {
			const requestId = event.target.getAttribute('data-id');
			console.log('Attempting to delete request with ID:', requestId);
			if (!requestId) {
				console.error('No request ID found for deletion.');
				return;
			}
			await deleteRequest(requestId);
			const { responseData, error } = await fetchSavedRequests();
			if (error) {
				renderSavedRequestsError(error.message, savedRequestsList);
			} else {
				renderSavedRequests(responseData.data, savedRequestsList);
			}
		});
	});
}

export async function refreshSavedRequests(savedRequestsList) {
	const { responseData, error } = await fetchSavedRequests();
	if (error) {
		renderSavedRequestsError(error.message, savedRequestsList);
	} else {
		renderSavedRequests(responseData.data, savedRequestsList);
	}
}

export function renderSavedRequests(requests, savedRequestsList) {
	savedRequestsList.innerHTML = '';

	if (!requests || requests.length === 0) {
		savedRequestsList.innerHTML = '<p>No saved requests available🔍</p>';
		return;
	}

	requests.forEach((request) => {
		const requestDiv = document.createElement('div');
		requestDiv.className = 'request-item';
		requestDiv.style.position = 'relative';
		requestDiv.innerHTML = `
				<div class="delete-cross" data-id="${request.id}">&times;</div>
                <p><strong>Method:</strong> ${request.method}</p>
                <p><strong>URL:</strong> ${request.url}</p> 
          `;
		savedRequestsList.appendChild(requestDiv);
	});
	addDeleteRequestListeners(savedRequestsList);
}

export function renderSavedRequestsError(errorMessage, savedRequestsList) {
	savedRequestsList.innerHTML = `<p>${errorMessage}</p>`;
}

export function renderResponse(responseData, responseElemObj) {
	const { status, statusText, headers, data } = responseData;
	const {
		responseContainer,
		responseMessage,
		statusElement,
		statusTextElement,
		responseHeadersTable,
		responseBody,
	} = responseElemObj;
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

export function renderResponseError(error, responseElemObj) {
	const {
		responseContainer,
		responseMessage,
		statusElement,
		statusTextElement,
		responseHeadersTable,
		responseBody,
	} = responseElemObj;

	console.error('Error:', error);
	responseContainer.style.display = 'block';
	responseMessage.style.display = 'none';
	responseHeadersTable.innerHTML = '';
	responseBody.innerText = '';
	statusElement.innerText = 'Error';
	statusTextElement.innerText = `Error occurred: ${error.message}`;
}

export function clearResponse(responseElemObj) {
	const {
		responseContainer,
		responseMessage,
		statusElement,
		statusTextElement,
		responseHeadersTable,
		responseBody,
	} = responseElemObj;

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
	responseElemObj,
) {
	requestForm.reset();
	paramsContainer.innerHTML = '';
	headersContainer.innerHTML = '';
	clearResponse(responseElemObj);
	displayPopup('success', 'Form cleared successfully!');
}
