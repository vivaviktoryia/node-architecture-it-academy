const { getAllRequestsService } = require('../../src/services/requestService');
const { loadRequests } = require('../../utils/requestStorage');
const AppError = require('../../utils/appError');

jest.mock('../../utils/requestStorage', () => ({
	loadRequests: jest.fn(),
}));


describe('getAllRequestsService', () => {
	it('Should return the requests if loading is successful', async () => {
		const mockFilePath = './path.json';

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
		const result = await getAllRequestsService(mockFilePath);
		expect(result).toEqual(mockRequests);
	});

	it('Should return an AppError if loading requests fails', async () => {
		const mockFilePath = './path.json';
		loadRequests.mockRejectedValue(new Error('File not found'));

		const result = await getAllRequestsService(mockFilePath);

		expect(result).toBeInstanceOf(AppError);
		expect(result.message).toBe('File not found');
		expect(result.status).toBe(500);
	});
});
