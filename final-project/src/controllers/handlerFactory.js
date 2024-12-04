const AppError = require('../../utils/appError');
const { catchAsync } = require('../../utils/catchAsync');

const APIFeatures = require('../../utils/apiFeatures');

const createOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const newRecord = await Model.create(req.body);

		res.status(201).json({
			status: 'success',
			data: {
				data: newRecord,
			},
		});
	});

const updateOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const updatedRecord = await Model.update(req.body, {
			where: { id: req.params.id },
			returning: true,
		});

		if (!updatedRecord) {
			return next(new AppError('Record  with that ID not found', 404));
		}

		res.status(200).json({
			status: 'success',
			data: {
				data: updatedRecord,
			},
		});
	});

const deleteOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const deletedRecord = await Model.destroy({
			where: { id: req.params.id },
		});

		if (!deletedRecord) {
			return next(new AppError('Record with that ID not found', 404));
		}

		res.status(204).json({
			status: 'success',
			data: null,
		});
	});

const getOne = (Model, includeOptions) =>
	catchAsync(async (req, res, next) => {
		const queryOptions = {
			where: { id: req.params.id },
			include: includeOptions || undefined,
		};

		const record = await Model.findOne(queryOptions);

		if (!record) {
			return next(new AppError('Record with that ID not found', 404));
		}

		res.status(200).json({
			status: 'success',
			data: {
				requestedTime: req.requestTime,
				data: record,
			},
		});
	});

const getAll = (Model) =>
	catchAsync(async (req, res, next) => {
		// Optional filtering for nested resources
		const filter = req.params.tourId ? { tourId: req.params.tourId } : {};

		// Count total records matching the filter
		const totalRecords = await Model.count({ where: filter });

		// EXECUTE QUERY
		const features = new APIFeatures(
			Model.findAll({ where: filter }),
			req.query,
		)
			.filter()
			.sort()
			.limitFields()
			.paginate();

		const records = await features.query;

		// SEND RESPONSE
		res.status(200).json({
			status: 'success',
			results: records.length,
			totalRecords,
			data: {
				data: records,
			},
			page: features.page,
			limit: features.limit,
		});
	});

module.exports = {
	deleteOne,
	updateOne,
	createOne,
	getOne,
	getAll,
};
