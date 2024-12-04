const createdAtField = '-createdAt';
const excludedFields = ['page', 'sort', 'limit', 'fields'];

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString; // queryString = req.query;
  }

  filter() {
    // FILTERING
    const queryObj = { ...this.queryString };
    excludedFields.forEach(el => delete queryObj[el]);

    // ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query.find(JSON.parse(queryStr));

    //  this.query = await Tour.find()
    //   .where('duration')
    //   .gte(5)
    //   .where('difficulty')
    //   .equals('easy');

    return this; // provide access to different methods to call on the object
  }

  // SORTING
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort(createdAtField); // default sorting
    }
    return this;
  }

  // FIELD LIMITING
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // to exclude fields need to add '-'
    }
    return this;
  }

  // PAGINATION
  paginate() {
    const page = +this.queryString.page || 1;
    const limit = +this.queryString.limit || 20;
    const skip = (page - 1) * limit;

    this.page = page; // Set the page property
    this.limit = limit; // Set the limit property

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
