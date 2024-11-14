const { getRequestByIdService } = require('../../src/services/requestService');
const { loadRequests } = require('../../utils/requestStorage');
const AppError = require('../../utils/appError');

jest.mock('../../utils/requestStorage', () => ({
	loadRequests: jest.fn(),
}));

describe('getRequestByIdService', () => {
	const mockFilePath = 'path/to/requests.json';

	it('Should return the request if found by ID', async () => {
		const mockRequests = [
			{
				id: '1730479980072',
				url: 'https://jsonplaceholder.typicode.com/posts',
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: { id: 'test', userId: 101 },
			},
			{
				id: '1731567139658',
				url: 'http://fe.it-academy.by/images/logo3.png',
				method: 'GET',
				headers: { accept: 'image/*' },
				body: {},
			},
		];

		loadRequests.mockResolvedValue(mockRequests);

		const requestId = '1730479980072';
		const result = await getRequestByIdService(requestId, mockFilePath);

		expect(result).toEqual(mockRequests[0]);
	});

	it('Should return an AppError if the request is not found', async () => {
		const mockRequests = [
			{
				id: '1730479980072',
				url: 'https://jsonplaceholder.typicode.com/posts',
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: { id: 'test', userId: 101 },
			},
		];

		loadRequests.mockResolvedValue(mockRequests);

		const requestId = '1';
		const result = await getRequestByIdService(requestId, mockFilePath);

		expect(result).toBeInstanceOf(AppError);
		expect(result.message).toBe('Request not found');
		expect(result.status).toBe(404);
	});

	it('Should return an AppError if loading requests fails', async () => {
		loadRequests.mockRejectedValue(new Error('Failed to load file'));

		const requestId = '1730479980072';
		const result = await getRequestByIdService(requestId, mockFilePath);

		expect(result).toBeInstanceOf(AppError);
		expect(result.message).toBe('Failed to load file');
		expect(result.status).toBe(500);
	});
});
