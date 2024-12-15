const path = require('path');
const express = require('express');
const { setupMorgan } = require('./utils/logger');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

const globalErrorHandler = require('./src/controllers/errorController');
const AppError = require('./utils/appError');

const viewRouter = require('./src/routes/viewRoutes');
const userRouter = require('./src/routes/userRoutes');
const tourRouter = require('./src/routes/tourRoutes');
const reviewRouter = require('./src/routes/reviewRoutes');

const locationRouter = require('./src/routes/locationRoutes');
const imageRouter = require('./src/routes/imageRoutes');
const bookingRouter = require('./src/routes/bookingRoutes');
const pluginRouter = require('./src/routes/pluginRoutes');
const pageRouter = require('./src/routes/pageRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.options('*', cors());
// body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// cookieParser
app.use(cookieParser());

// Prevent parameter pollution
app.use(
	hpp({
		whitelist: [
			'ratingsAverage',
			'duration',
			'name',
			'ratingsQuantity',
			'maxGroupSize',
			'difficulty',
			'price',
		],
	}),
);

// Logger
setupMorgan(app);

app.use(express.static(path.join(__dirname, 'public')));

// Limit requests from same API
const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// ROUTES:
app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/reviews', reviewRouter);

app.use('/api/v1/locations', locationRouter);
app.use('/api/v1/images', imageRouter);
app.use('/api/v1/bookings', bookingRouter);

app.use('/api/v1/admin/plugins', pluginRouter);
app.use('/api/v1/admin/pages', pageRouter);

app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
