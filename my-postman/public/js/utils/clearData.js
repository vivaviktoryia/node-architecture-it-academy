import { displayPopup } from './popup.js';

export function clearParamsAndHeaders(paramsContainer, headersContainer) {
	paramsContainer.innerHTML = '';
	headersContainer.innerHTML = '';
}

export function clearForm(
	requestForm,
	paramsContainer,
	headersContainer,
	responseElemObj,
) {
	requestForm.reset();
	clearParamsAndHeaders(paramsContainer, headersContainer);
	clearResponse(responseElemObj);
	displayPopup('success', 'Form cleared successfully!');
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
