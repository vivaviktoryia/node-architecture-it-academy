const { readFile, writeFile } = require('fs').promises;

async function saveRequest(newRequest, filePath) {
	try {
		const requests = await loadRequests(filePath);
		requests.push(newRequest);

		await writeFile(filePath, JSON.stringify(requests, null, 2));
	} catch (err) {
		console.error('Error saving request:', err);
	}
}

async function loadRequests(filePath) {
	try {
		const data = await readFile(filePath, 'utf8');
		return JSON.parse(data || '[]');
	} catch (err) {
		console.error('Error loading requests:', err);
		return [];
	}
}

async function removeRequest(indexToRemove, requestsFilePath) {
	try {
		const requests = await loadRequests(requestsFilePath);

		if (indexToRemove >= 0 && indexToRemove < requests.length) {
			requests.splice(indexToRemove, 1);
			await writeFile(requestsFilePath, JSON.stringify(requests, null, 2));
		} else {
			console.error('Index out of bounds:', indexToRemove);
		}
	} catch (err) {
		console.error('Error removing request:', err);
	}
}

module.exports = {
	saveRequest,
	loadRequests,
	removeRequest,
};
