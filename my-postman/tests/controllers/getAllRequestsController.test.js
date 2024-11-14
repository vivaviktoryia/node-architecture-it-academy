const httpMocks = require('node-mocks-http');
const { getAllRequests } = require('../../src/controllers/requestController');
const { getAllRequestsService } = require('../../src/services/requestService');
const AppError = require('../../utils/appError');

jest.mock('../../src/services/requestService');

describe('getAllRequests Controller', () => {
	let mockReq, mockRes, mockNext;

	beforeEach(() => {
		mockReq = httpMocks.createRequest();
		mockRes = httpMocks.createResponse();
		mockNext = jest.fn();
	});

	it('Should return a 200 status and a JSON response with data', async () => {
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
				headers: {
					accept: 'image/*',
				},
				body: {},
			},
		];
		getAllRequestsService.mockResolvedValue(mockRequests);

		await getAllRequests(mockReq, mockRes, mockNext);

		expect(mockRes.statusCode).toBe(200);
		expect(mockRes._getData()).toBe(
			JSON.stringify({
				status: 'success',
				data: mockRequests,
			}),
		);
		expect(mockNext).not.toHaveBeenCalled();
	});

	it('Should call next with an AppError if the service fails', async () => {
		getAllRequestsService.mockRejectedValue(new Error('Service Error'));

		await getAllRequests(mockReq, mockRes, mockNext);

		expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
		expect(mockNext.mock.calls[0][0].message).toBe(
			'Failed to retrieve requests',
		);
		expect(mockNext.mock.calls[0][0].status).toBe(500);
	});
});
