const { getRequest } = require('../../src/controllers/requestController');
const { getRequestByIdService } = require('../../src/services/requestService');
const AppError = require('../../utils/appError');

jest.mock('../../src/services/requestService');

describe('getRequest Controller', () => {
	let mockReq, mockRes, mockNext;

	beforeEach(() => {
		mockReq = {};
		mockRes = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		mockNext = jest.fn();
	});

	it('Should return a 200 status and the request data if found', async () => {
		const mockRequest = {
			id: '123',
			url: 'https://example.com',
			method: 'GET',
			headers: { accept: 'application/json' },
			body: {},
		};

		getRequestByIdService.mockResolvedValue(mockRequest);
		mockReq.params = { requestId: '123' };

		await getRequest(mockReq, mockRes, mockNext);

		expect(mockRes.status).toHaveBeenCalledWith(200);
		expect(mockRes.json).toHaveBeenCalledWith({
			status: 200,
			statusText: 'OK',
			data: mockRequest,
			error: null,
		});
		expect(mockNext).not.toHaveBeenCalled();
	});

	it('Should call next with an AppError if the request is not found', async () => {
		getRequestByIdService.mockResolvedValue(null);
		mockReq.params = { requestId: '123' };

		await getRequest(mockReq, mockRes, mockNext);

		expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
		expect(mockNext.mock.calls[0][0].message).toBe('Request not found');
		expect(mockNext.mock.calls[0][0].status).toBe(404);
	});

	it('Should call next with an AppError if there is a service error', async () => {
		getRequestByIdService.mockRejectedValue(new Error('Service Error'));
		mockReq.params = { requestId: '123' };

		await getRequest(mockReq, mockRes, mockNext);

		expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
		expect(mockNext.mock.calls[0][0].message).toBe(
			'An error occurred while retrieving the request',
		);
		expect(mockNext.mock.calls[0][0].status).toBe(500);
	});

	it('Should return a 400 error if requestId is not provided', async () => {
		mockReq.params = {};

		await getRequest(mockReq, mockRes, mockNext);

		expect(mockNext).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Request ID is required',
				status: 400,
			}),
		);
	});
});
