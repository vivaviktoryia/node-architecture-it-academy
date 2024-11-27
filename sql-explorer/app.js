const path = require('path');
const express = require('express');
const globalErrorHandler = require('./src/controllers/errorController');
const AppError = require('./src/utils/appError');

const viewRouter = require('./src/routes/viewRoutes');
const queryRouter = require('./src/routes/queryRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(express.static(path.join(__dirname, 'public')));

// ROUTES:
app.use('/', viewRouter);
app.use('/api/v1/query', queryRouter);

app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
