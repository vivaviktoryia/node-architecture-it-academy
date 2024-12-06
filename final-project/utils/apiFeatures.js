const createdAtField = 'createdAt';
const excludedFields = ['page', 'sort', 'limit', 'fields'];

class APIFeatures {
	constructor(initialQueryOptions, queryString) {
		this.query = { ...initialQueryOptions };
		this.queryString = queryString; // req.query
	}

	filter() {
		// Basic filtering
		const queryObj = { ...this.queryString };
		excludedFields.forEach((el) => delete queryObj[el]);

		// Advanced filtering
		Object.keys(queryObj).forEach((key) => {
			const value = queryObj[key];
			if (typeof value === 'object' && value !== null) {
				Object.keys(value).forEach((operator) => {
					const numericValue = Number(value[operator]);

					if (!isNaN(numericValue)) {
						this.query.where = {
							...this.query.where,
							[key]: { [`$${operator}`]: numericValue },
						};
					} else {
						console.log(
							'Error: The value is not a valid number:',
							value[operator],
						);
					}
				});
			} else {
				const queryValue = !isNaN(value) ? Number(value) : value;
				this.query.where = {
					...this.query.where,
					[key]: queryValue,
				};
			}
		});

		return this;
	}

	sort() {
		if (this.queryString.sort) {
			const sortBy = this.queryString.sort
				.split(',')
				.map((field) => [field, 'ASC']);
			this.query.order = sortBy;
		} else {
			this.query.order = [[createdAtField, 'DESC']]; // Default sorting
		}
		return this;
	}

	limitFields() {
		if (this.queryString.fields) {
			this.query.attributes = this.queryString.fields.split(',');
		}
		return this;
	}

	paginate() {
		const page = +this.queryString.page || 1;
		const limit = +this.queryString.limit || 20;
		const offset = (page - 1) * limit;

		this.page = page;
		this.limit = limit;

		this.query.limit = limit;
		this.query.offset = offset;

		return this;
	}
}

module.exports = APIFeatures;
