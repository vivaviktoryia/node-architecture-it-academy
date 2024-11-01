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

export async function fetchAndPopulateRequest(requestId) {
	try {
		const response = await fetch(`/api/v1/requests/${requestId}`);

		if (!response.ok) {
			displayPopup('error', `Error fetching request: ${response.statusText}`);
			throw new Error(`Error fetching request: ${response.statusText}`);
		}

		const responseData = await response.json();
	return { responseData, error: null };
	} catch (error) {
		console.error('Error fetching request:', error);
		displayPopup('error', `Error fetching request: ${response.statusText}`);
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
	} catch (error) {
		console.error('Error deleting request:', error);
		displayPopup('error', 'Error deleting request:', error);
	}
}
