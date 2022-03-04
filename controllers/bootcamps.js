const Bootcamps = require("../database/models/Bootcamps");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access    Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  // Copy req.query
  const reqQuery = { ...req.query };

  // Bo cac field de query dc
  const removeFields = ["select", "sort", "page", "limit"];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  //chuyen doi query parameter trong URL qua String de manipulate
  let queryString = JSON.stringify(req.query);

  // Regex bat dau double foward slash, \b la search pattern
  // g(global) o cuoi de tim toan bo trong document, khong dung lai o tim kiem dau tien
  // $match la MongoDB syntax
  // src: https://docs.mongodb.com/manual/reference/operator/query-comparison/
  // `${}` template literal
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Finding resource
  let query = Bootcamps.find(JSON.parse(queryString)).populate('courses');

  // Select Fields
  // src: https://mongoosejs.com/docs/queries.html
  // keyword: select
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" "); //split chuyen tu query => array, join chuyen tu array => string
    query = query.select(fields);
  }

  // Sort
  // src: https://mongoosejs.com/docs/queries.html
  // keyword: sort

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  //Pagination
  const page = parseInt(req.query.page, 10) || 1; // Thu tu trang
  const limit = parseInt(req.query.limit, 10) || 10; //Gioi han moi trang
  const startIndex = (page - 1) * limit; // Item bat dau moi trang (skip cac trang truoc)

  const endIndex = page * limit; // hien thi cac trang...
  const total = await Bootcamps.countDocuments(); // tiep theo

  query = query.skip(startIndex).limit(limit);

  //Executing query
  const bootcamps = await query;

  //Ket qua phan trang
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
});

// @desc    Get single bootcamps
// @route   GET /api/v1/bootcamps/:id
// @access  Private

exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamps.findById(req.params.id);
  if (!bootcamp) {
    next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc    Create new bootcamps
// @route   POST /api/v1/bootcamps/
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamps.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamps.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamps.findByIdAndDelete(req.params.id);

  if (!bootcamp) {
    next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  bootcamp.remove();// trigger cascade delete middleware
  res.status(200).json({ success: true, data: {} });
});
