const express = require('express');
const path = require('path');
const customCors = require('./utils/cors');
const AppError = require('./utils/appError');
const { globalErrorHandler } = require('./src/controllers/errorController');

const requestRouter = require('./src/routes/requestRoutes');
const viewRouter = require('./src/routes/viewRoutes');

const {
	loggerMiddleware,
} = require('./utils/logger');

const app = express();

app.use(customCors);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Request Body Parser
app.use(express.json({ limit: '10kb' })); // content-type: application/json -> JSON.parse(req.body)
app.use(express.urlencoded({ extended: true, limit: '10kb' })); // content-type: application/x-www-form-urlencoded

app.use(loggerMiddleware);

app.use(express.static(path.join(__dirname, 'public')));

// ROUTES:
app.use('/', viewRouter);
// getAllRequests, getRequest, deleteRequest, createRequest
app.use('/api/v1/requests', requestRouter);
// sendRequest
app.use('/api/v1/request', requestRouter);

// 404 error
app.all('*', (req, res, next) => {
	const errorMsg = `Can't find ${req.originalUrl} on this server!`;
	next(new AppError(errorMsg, 404, { statusText: 'Not Found!' }));
});

app.use(globalErrorHandler);

module.exports = app;
