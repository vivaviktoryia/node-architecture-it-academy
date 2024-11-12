class AppError extends Error {
	constructor(message, status, options = {}) {
		super(message);
		this.status = status;
		this.statusText = options.statusText || null;
		this.details = options.details || null;
		this.headers = options.headers || null;
	}
}

module.exports = AppError;


