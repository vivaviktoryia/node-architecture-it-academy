const AppError = require('../../utils/appError');
const { catchAsync } = require('../../utils/catchAsync');
const APIFeatures = require('../../utils/apiFeatures');

const createOne = (Model, associationsConfig = {}) =>
	catchAsync(async (req, res, next) => {
		const sequelize = Model.sequelize;
		const { ...recordData } = req.body;

		const transaction = await sequelize.transaction();

		try {
			const responseData = {
				mainRecord: null,
				associations: {},
			};

			// Validate associations
			for (const [assocName, options] of Object.entries(associationsConfig)) {
				const { required = false, minLength = 0 } = options;
				const assocData = req.body[assocName];

				if (required && (!assocData || assocData.length < minLength)) {
					return next(
						new AppError(
							`${assocName} should have at least ${minLength} ${
								minLength === 1 ? 'item' : 'items'
							}.`,
							400,
						),
					);
				}
			}

			// Create main record
			const newRecord = await Model.create(recordData, { transaction });
			responseData.mainRecord = newRecord;

			// Handle associations
			for (const [assocName, options] of Object.entries(associationsConfig)) {
				const { model, through, attributes } = options;
				const assocData = req.body[assocName];

				if (assocData) {
					const existingRecords = await sequelize.models[model].findAll({
						where: { id: assocData },
						attributes: attributes || undefined,
					});

					if (existingRecords.length !== assocData.length) {
						return next(
							new AppError(`Some ${assocName} records were not found.`, 404),
						);
					}

					const addMethod = through
						? `add${assocName.charAt(0).toUpperCase() + assocName.slice(1)}`
						: `set${assocName.charAt(0).toUpperCase() + assocName.slice(1)}`;
					await newRecord[addMethod](existingRecords, { transaction });

					// Add association data to the response
					responseData.associations[assocName] = existingRecords;
				}
			}
			await transaction.commit();

			res.status(201).json({
				status: 'success',
				data: responseData,
			});
		} catch (error) {
			await transaction.rollback();
			next(error);
		}
	});

const updateOne = (Model, associations = {}) =>
	catchAsync(async (req, res, next) => {
		const sequelize = Model.sequelize;
		const transaction = await sequelize.transaction();

		try {
			const [updatedRowsCount] = await Model.update(req.body, {
				where: { id: req.params.id },
				transaction,
			});

			if (updatedRowsCount === 0) {
				return next(new AppError('Record with that ID not found', 404));
			}

			const updatedRecord = await Model.findByPk(req.params.id, {
				transaction,
			});

			if (!updatedRecord) {
				return next(new AppError('Record with that ID not found', 404));
			}

			for (const [assocName, assocConfig] of Object.entries(associations)) {
				const assocKey = assocConfig.foreignKey;
				const assocData = req.body[assocKey];

				if (!assocData) continue;

				const associatedModel = sequelize.models[assocConfig.model];

				const existingAssoc = await associatedModel.findAll({
					where: { id: assocData },
				});
				if (existingAssoc.length === 0) {
					return next(new AppError(`Some ${assocName} were not found`, 400));
				}
				const associatedIds = existingAssoc.map((assoc) => assoc.id);
				const setMethod = `set${
					assocName.charAt(0).toUpperCase() + assocName.slice(1)
				}`;
				await updatedRecord[setMethod](associatedIds, { transaction });
			}

			await transaction.commit();

			const queryOptions = {
				include: Object.entries(associations).map(
					([assocName, assocConfig]) => ({
						model: sequelize.models[assocConfig.model],
						as: assocName,
						attributes: assocConfig.attributes || undefined,
						through: assocConfig.through ? { attributes: [] } : undefined,
					}),
				),
				attributes: req.query.fields ? req.query.fields.split(',') : undefined,
			};

			const result = await Model.findByPk(req.params.id, queryOptions);

			res.status(200).json({
				status: 'success',
				data: result,
			});
		} catch (error) {
			await transaction.rollback();
			next(error);
		}
	});

const deleteOne = (Model, associationsConfig = {}) =>
	catchAsync(async (req, res, next) => {
		const sequelize = Model.sequelize;
		const { id } = req.params;

		const transaction = await sequelize.transaction();

		try {
			const includeConfig = Object.keys(associationsConfig).map((assocName) => {
				const options = associationsConfig[assocName];
				const model = sequelize.models[options.model];

				if (!model) {
					return next(new AppError('Invalid model name:', options.model, 400));
				}

				return {
					model,
					as: assocName,
					required: false,
				};
			});

			const recordToDelete = await Model.findOne({
				where: { id },
				transaction,
				include: includeConfig,
			});

			if (!recordToDelete) {
				return next(new AppError('Record with that ID not found', 404));
			}

			for (const [assocName, options] of Object.entries(associationsConfig)) {
				const assocData = recordToDelete[assocName];

				if (assocData) {
					const removeMethodName = `remove${
						assocName.charAt(0).toUpperCase() + assocName.slice(1)
					}`;

					if (typeof recordToDelete[removeMethodName] === 'function') {
						await recordToDelete[removeMethodName](assocData, { transaction });
					} else {
						return next(new AppError(
							`Method ${removeMethodName} does not exist on recordToDelete`,400
						));
					}

					if (options.deleteAssociated) {
						const associatedModel = sequelize.models[options.model];
						await associatedModel.destroy({
							where: {
								id: assocData.map((item) => item.id),
							},
							transaction,
						});
					}
				}
			}

			await recordToDelete.destroy({ transaction });

			await transaction.commit();

			res.status(204).json({
				status: 'success',
				data: null,
			});
		} catch (error) {
			await transaction.rollback();
			next(error);
		}
	});

const getOne = (Model, associations = {}) =>
	catchAsync(async (req, res, next) => {
		const queryOptions = {
			where: { id: req.params.id },
			include: Object.entries(associations).map(([assocName, assocConfig]) => ({
				model: Model.sequelize.models[assocConfig.model],
				as: assocName,
				through: assocConfig.through ? { attributes: [] } : undefined,
				attributes: assocConfig.attributes || undefined,
			})),
		};

		const record = await Model.findOne(queryOptions);

		if (!record) {
			return next(new AppError('Record with that ID not found', 404));
		}

		res.status(200).json({
			status: 'success',
			data: record,
		});
	});

const getAll = (Model, associations = {}) =>
	catchAsync(async (req, res, next) => {
		const filter = req.params.tourId ? { tourId: req.params.tourId } : {};

		const totalRecords = await Model.count({ where: filter });

		const features = new APIFeatures(
			Model.findAll({ where: filter }),
			req.query,
		)
			.filter()
			.sort()
			.limitFields()
			.paginate();

		const { where, order, attributes, limit, offset } = features.query;

		const include = Object.entries(associations).map(
			([assocName, assocConfig]) => ({
				model: Model.sequelize.models[assocConfig.model],
				as: assocName,
				through: assocConfig.through ? { attributes: [] } : undefined,
				attributes: assocConfig.attributes || undefined,
			}),
		);

		const records = await Model.findAll({
			where,
			order,
			attributes,
			limit,
			offset,
			include,
		});

		res.status(200).json({
			status: 'success',
			results: records.length,
			totalRecords,
			data: records,
			page: features.page,
			limit: features.limit,
		});
	});

// 1 MODEL
// POST
// const createOne = (Model) =>
// 	catchAsync(async (req, res, next) => {
// 		const newRecord = await Model.create(req.body);

// 		res.status(201).json({
// 			status: 'success',
// 			data: {
// 				data: newRecord,
// 			},
// 		});
// 	});

// GET
// const getAll = (Model) =>
// 	catchAsync(async (req, res, next) => {
// 		// Optional filtering for nested resources
// 		const filter = req.params.tourId ? { tourId: req.params.tourId } : {};

// 		// Count total records matching the filter
// 		const totalRecords = await Model.count({ where: filter });

// 		// EXECUTE QUERY
// 		const features = new APIFeatures(
// 			Model.findAll({ where: filter }),
// 			req.query,
// 		)
// 			.filter()
// 			.sort()
// 			.limitFields()
// 			.paginate();

// 		const { where, order, attributes, limit, offset } = features.query;
// 		const records = await Model.findAll({
// 			where,
// 			order,
// 			attributes,
// 			limit,
// 			offset,
// 		});

// 		res.status(200).json({
// 			status: 'success',
// 			results: records.length,
// 			totalRecords,
// 			data: {
// 				data: records,
// 			},
// 			page: features.page,
// 			limit: features.limit,
// 		});
// 	});

// GET
// const getOne = (Model) =>
// 	catchAsync(async (req, res, next) => {
// 		const queryOptions = {
// 			where: { id: req.params.id },
// 		};

// 		const record = await Model.findOne(queryOptions);

// 		if (!record) {
// 			return next(new AppError('Record with that ID not found', 404));
// 		}

// 		res.status(200).json({
// 			status: 'success',
// 			data: {
// 				data: record,
// 			},
// 		});
// 	});

// PATCH
// const updateOne = (Model) =>
// 	catchAsync(async (req, res, next) => {
// 		const updatedRowsCount = await Model.update(req.body, {
// 			where: { id: req.params.id },
// 		});

// 		if (updatedRowsCount[0] === 0) {
// 			return next(new AppError('Record with that ID not found', 404));
// 		}

// 		const updatedRecord = await Model.findByPk(req.params.id);

// 		if (!updatedRecord) {
// 			return next(new AppError('Record  with that ID not found', 404));
// 		}

// 		res.status(200).json({
// 			status: 'success',
// 			data: {
// 				data: updatedRecord,
// 			},
// 		});
// 	});

// DELETE
// const deleteOne = (Model) =>
// 	catchAsync(async (req, res, next) => {
// 		const deletedRecord = await Model.destroy({
// 			where: { id: req.params.id },
// 		});

// 		if (!deletedRecord) {
// 			return next(new AppError('Record with that ID not found', 404));
// 		}

// 		res.status(204).json({
// 			status: 'success',
// 			data: null,
// 		});
// 	});

module.exports = {
	deleteOne,
	updateOne,
	createOne,
	getOne,
	getAll,
};
