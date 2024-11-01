import { addQueryParam } from './components/queryParams.js';
import { addHeader } from './components/reqHeaders.js';
import {
	saveRequest,
	sendRequest,
	fetchSavedRequests,
	deleteRequest,
	clearForm,
	clearResponse,
	renderResponse,
	renderResponseError,
	renderSavedRequests,
	renderSavedRequestsError,
} from './utils/formUtils.js';

import { showTabContent } from './components/resTabManager.js';
import { displayPopup } from './utils/popup.js';

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
	const clearFormButton = document.getElementById('clearForm');
	const saveRequestButton = document.getElementById('saveRequest');

	// RESPONSE
	const responseContainer = document.querySelector('.response-container');
	const responseMessage = document.querySelector('.responseMessage');
	const statusElement = document.getElementById('status');
	const statusTextElement = document.getElementById('statusText');

	const tabBody = document.getElementById('tabBody');
	const bodyTabContent = document.getElementById('bodyTab');
	const tabHeader = document.getElementById('tabHeader');
	const headersTabContent = document.getElementById('headersTab');

	const responseHeadersTable = document.getElementById('responseHeaders');
	const responseBody = document.getElementById('responseBody');

	//SAVED REQUESTS
	const savedRequestsList = document.getElementById('savedRequestsList');
	const refreshRequestsButton = document.getElementById('refreshRequests');

	////////////////////////////
	const responseElemObj = {
		responseContainer,
		responseMessage,
		statusElement,
		statusTextElement,
		responseHeadersTable,
		responseBody,
	};

	addParamButton.addEventListener('click', () =>
		addQueryParam(paramsContainer),
	);

	addHeaderButton.addEventListener('click', () => addHeader(requestHeaders));

	// SAVE REQUEST
	saveRequestButton.addEventListener('click', async () => {
		await  saveRequest(
			urlInput,
			paramsContainer,
			selectedMethod,
			requestBodyContentType,
			requestBody,
		);
		
		const { responseData, error } = await fetchSavedRequests();
		if (error) {
			renderSavedRequestsError(error.message, savedRequestsList);
		} else {
			renderSavedRequests(responseData.data, savedRequestsList);
		}
	});

	// CLEAR FORM
	clearFormButton.addEventListener('click', () => {
		clearForm(requestForm, paramsContainer, requestHeaders, responseElemObj);
	});

	// SEND REQUEST
	requestForm.addEventListener('submit', async (event) => {
		event.preventDefault();

		clearResponse(responseElemObj);

		const { responseData, error } = await sendRequest(
			urlInput,
			paramsContainer,
			selectedMethod,
			requestBodyContentType,
			requestBody,
		);

		if (error) {
			renderResponseError(error, responseElemObj);
		} else {
			renderResponse(responseData, responseElemObj);
		}
	});

	//SAVED REQUESTS: Initial load of saved requests and REFRESH button
	(async () => {
		const { responseData, error } = await fetchSavedRequests();
		if (error) {
			renderSavedRequestsError(error.message, savedRequestsList);
		} else {
			renderSavedRequests(responseData.data, savedRequestsList);
		}
	})();

	refreshRequestsButton.addEventListener('click', async () => {
		const { responseData, error } = await fetchSavedRequests();
		if (error) {
			renderSavedRequestsError(error.message, savedRequestsList);
		} else {
			renderSavedRequests(responseData.data, savedRequestsList);
		}
	});


	// RESPONSE - tab logic
	tabBody.addEventListener('click', () =>
		showTabContent(
			'Body',
			bodyTabContent,
			headersTabContent,
			tabBody,
			tabHeader,
		),
	);
	tabHeader.addEventListener('click', () =>
		showTabContent(
			'Headers',
			bodyTabContent,
			headersTabContent,
			tabBody,
			tabHeader,
		),
	);
});
