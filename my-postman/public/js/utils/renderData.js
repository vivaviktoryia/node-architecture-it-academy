import {
	fetchSavedRequests,
	fetchAndPopulateRequest,
	deleteRequest,
} from './formUtils.js';
import { clearParamsAndHeaders } from './clearData.js';
import { addQueryParam, getQueryParams } from '../components/queryParams.js';

export function renderSavedRequests(
	requests,
	savedRequestsList,
	requestElemObj,
) {
	savedRequestsList.innerHTML = '';

	if (!requests || requests.length === 0) {
		savedRequestsList.innerHTML = '<p>No saved requests available🔍</p>';
		return;
	}

	requests.forEach((request) => {
		const requestDiv = createRequestDiv(request, requestElemObj);
		savedRequestsList.appendChild(requestDiv);
	});
	addDeleteRequestListeners(savedRequestsList);
}

function createRequestDiv(request, requestElemObj) {
	const requestDiv = document.createElement('div');
	requestDiv.className = 'request-item';
	requestDiv.style.position = 'relative';
	requestDiv.innerHTML = `
        <div class="delete-cross" data-id="${request.id}">&times;</div>
        <p><strong>Method:</strong> ${request.method}</p>
        <p><strong>URL:</strong> ${request.url}</p>
    `;

	requestDiv.addEventListener('click', async () => {
		await handleRequestClick(request.id, requestElemObj);
	});

	return requestDiv;
}

async function handleRequestClick(requestId, requestElemObj) {
	const { responseData } = await fetchAndPopulateRequest(requestId);
	const {
		urlInput,
		selectedMethod,
		paramsContainer,
		requestHeaders,
		requestBodyContentType,
		requestBody,
	} = requestElemObj;
	if (responseData) {
		populateRequestForm(
			responseData.data,
			urlInput,
			selectedMethod,
			paramsContainer,
			requestHeaders,
			requestBodyContentType,
			requestBody,
		);
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

export async function refreshSavedRequests(savedRequestsList) {
	const { responseData, error } = await fetchSavedRequests();
	if (error) {
		renderSavedRequestsError(error.message, savedRequestsList);
	} else {
		renderSavedRequests(responseData.data, savedRequestsList);
	}
}

export function populateRequestForm(
	request,
	urlInputEl,
	selectedMethodEl,
	paramsContainerEl,
	headersContainerEl,
	requestBodyContentTypeEl,
	requestBodyEl,
) {
	if (!request) return;
	const url = new URL(request.url);
	urlInputEl.value = url.origin + url.pathname;

	selectedMethodEl.value = request.method;

	clearParamsAndHeaders(paramsContainerEl, headersContainerEl);

	const params = getQueryParams(request.url);
	if (params && params.length > 0) {
		params.forEach((param) =>
			addQueryParam(paramsContainerEl, param.key, param.value),
		);
	}

	// if (request.headers && Array.isArray(request.headers)) {
	// 	request.headers.forEach((header) => addHeader(header.key, header.value));
	// }

	requestBodyContentTypeEl.value =
		request.bodyContentType || 'application/json';
	if (typeof request.body === 'object') {
		requestBodyEl.value = JSON.stringify(request.body, null, 2); 
	} else {
		requestBodyEl.value = request.body || ''; 
	}
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