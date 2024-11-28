const express = require('express');
const path = require('path');
const { setupMorgan } = require('./utils/logger');
const globalErrorHandler = require('./src/controllers/errorController');
const AppError = require('./utils/appError');

const viewRouter = require('./src/routes/viewRoutes');
const fileRouter = require('./src/routes/fileRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Logger
setupMorgan(app);

app.use(express.static(path.join(__dirname, 'public')));

// ROUTES:
app.use('/api/v1', fileRouter);

// app.use('/', viewRouter);

app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
