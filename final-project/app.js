const path = require('path');
const express = require('express');
const { setupMorgan } = require('./utils/logger');
const cookieParser = require('cookie-parser');

const globalErrorHandler = require('./src/controllers/errorController');
const AppError = require('./utils/appError');

const viewRouter = require('./src/routes/viewRoutes');
const userRouter = require('./src/routes/userRoutes');
const tourRouter = require('./src/routes/tourRoutes');
const reviewRouter = require('./src/routes/reviewRoutes');

const locationRouter = require('./src/routes/locationRoutes');
const imageRouter = require('./src/routes/imageRoutes');
const bookingRouter = require('./src/routes/bookingRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// cookieParser
app.use(cookieParser());

// Logger
setupMorgan(app);

app.use(express.static(path.join(__dirname, 'public')));

// ROUTES:
app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/reviews', reviewRouter);

app.use('/api/v1/locations', locationRouter);
app.use('/api/v1/images', imageRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
