import { addQueryParam } from './components/queryParams.js';
import { addHeader } from './components/reqHeaders.js';
import {
	saveRequest,
	sendRequest,
	fetchSavedRequests,
	deleteRequest,
	fetchAndPopulateRequest,
} from './utils/formUtils.js';

import {
	renderResponse,
	renderSavedRequests,
	renderSavedRequestsError,
} from './utils/renderData.js';

import {
	clearForm,
	clearResponse,
	clearParamsAndHeaders,
} from './utils/clearData.js';

import { showTabContent } from './components/resTabManager.js';

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

	const tabPrettyBody = document.getElementById('prettyBodyButton');
	const tabRawBody = document.getElementById('rawBodyButton');
	const tabHeader = document.getElementById('tabHeader');

	const prettyBodyContent = document.getElementById('prettyBodyContent');
	const rawBodyContent = document.getElementById('rawBodyContent');
	const headerContent = document.getElementById('headersTab');

	const responseHeadersTable = document.getElementById('responseHeaders');
	const responsePrettyBody = document.getElementById('responsePrettyBody');
	const responseRawBody = document.getElementById('responseRawBody');

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
		responseRawBody,
		responsePrettyBody,
	};

	const requestElemObj = {
		urlInput,
		selectedMethod,
		paramsContainer,
		requestHeaders,
		requestBodyContentType,
		requestBody,
	};

	addParamButton.addEventListener('click', () =>
		addQueryParam(paramsContainer),
	);

	addHeaderButton.addEventListener('click', () => addHeader(requestHeaders));

	// SAVE REQUEST
	saveRequestButton.addEventListener('click', async () => {
		await saveRequest(
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
			renderSavedRequests(responseData.data, savedRequestsList, requestElemObj);
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

		const { responseData } = await sendRequest(
			urlInput,
			paramsContainer,
			selectedMethod,
			requestBodyContentType,
			requestBody,
		);

		renderResponse(responseData, responseElemObj);
	});

	//SAVED REQUESTS: Initial load of saved requests and REFRESH button
	(async () => {
		const { responseData, error } = await fetchSavedRequests();
		if (error) {
			renderSavedRequestsError(error.message, savedRequestsList);
		} else {
			renderSavedRequests(responseData.data, savedRequestsList, requestElemObj);
		}
	})();

	refreshRequestsButton.addEventListener('click', async () => {
		const { responseData, error } = await fetchSavedRequests();
		if (error) {
			renderSavedRequestsError(error.message, savedRequestsList);
		} else {
			renderSavedRequests(responseData.data, savedRequestsList, requestElemObj);
		}
	});

	// RESPONSE - tab logic
	tabPrettyBody.addEventListener('click', function () {
		showTabContent(
			'Pretty Body',
			prettyBodyContent,
			rawBodyContent,
			headerContent,
			tabPrettyBody,
			tabRawBody,
			tabHeader,
		);
	});

	tabRawBody.addEventListener('click', function () {
		showTabContent(
			'Raw Body',
			prettyBodyContent,
			rawBodyContent,
			headerContent,
			tabPrettyBody,
			tabRawBody,
			tabHeader,
		);
	});

	tabHeader.addEventListener('click', function () {
		showTabContent(
			'Headers',
			prettyBodyContent,
			rawBodyContent,
			headerContent,
			tabPrettyBody,
			tabRawBody,
			tabHeader,
		);
	});
});
