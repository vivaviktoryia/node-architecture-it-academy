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

export function renderResponse(responseData, responseElemObj) {
	const {
		status,
		statusText,
		data,
		error,
		headers: responseHeaders,
	} = responseData;
	const headers = data ? responseHeaders : error?.headers || {};
	const responseContent = data || error?.message || null;

	const {
		responseContainer,
		responseMessage,
		statusElement,
		statusTextElement,
		responseHeadersTable,
		responseRawBody,
		responsePrettyBody,
	} = responseElemObj;

	updateStatusElements(status, statusText, statusElement, statusTextElement);
	populateHeaders(headers, responseHeadersTable);
	populateBody(
		headers,
		responseContent,
		responsePrettyBody,
		responseRawBody,
		responseContainer,
		responseMessage,
	);
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

function populateBody(
	headers,
	data,
	responsePrettyBody,
	responseRawBody,
	responseContainer,
	responseMessage,
) {
	// RAW BODY
	populateRawBody(data, responseRawBody);

	// PRETTY BODY
	populatePrettyBody(headers, data, responsePrettyBody);

	responseContainer.style.display = 'block';
	responseMessage.style.display = 'none';
}

// RAW BODY
function populateRawBody(data, responseRawBody) {
	responseRawBody.innerText = JSON.stringify(data, null, 2) || 'No Body';
}

// PRETTY BODY
function populatePrettyBody(headers, data, responsePrettyBody) {
	if (isBase64(data)) {
		handleBinaryData(headers, data, responsePrettyBody);
	} else {
		handleTextData(headers, data, responsePrettyBody);
	}
}

function handleBinaryData(headers, data, responsePrettyBody) {
	const contentType = headers['content-type'] || '';

	if (contentType.includes('image')) {
		renderImage(data, contentType, responsePrettyBody);
	} else if (contentType.includes('pdf')) {
		renderPDF(data, contentType, responsePrettyBody);
	} else {
		renderGenericFile(data, contentType, responsePrettyBody);
	}
}

function renderImage(data, contentType, responsePrettyBody) {
	responsePrettyBody.innerHTML = `<img src="data:${contentType};base64,${data}" alt="image" />`;
}

// function renderPDF(data, contentType, responseBody) {
// 	responseBody.innerHTML = `<a href="data:${contentType};base64,${data}" download="file.pdf">Download PDF</a>`;
// }

function renderPDF(data, contentType, responsePrettyBody) {
	responsePrettyBody.innerHTML = `<iframe src="data:${contentType};base64,${data}" width="100%" height="600px"></iframe>`;
}

function renderGenericFile(data, contentType, responsePrettyBody) {
	responsePrettyBody.innerHTML = `<a href="data:${contentType};base64,${data}" download="file">Download File</a>`;
}

function handleTextData(headers, data, responsePrettyBody) {
	if (isHtmlContentType(headers)) {
		responsePrettyBody.innerHTML = data;
	} else {
		responsePrettyBody.innerText = JSON.stringify(data, null, 2) || 'No Body';
	}
}

function isHtmlContentType(headers) {
	return (
		headers['content-type'] && headers['content-type'].includes('text/html')
	);
}

function isBase64(str) {
	return typeof str === 'string' && /^([A-Za-z0-9+/=]){4,}$/.test(str);
}
