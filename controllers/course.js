const Course = require("../database/models/Course");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Bootcamp = require("../database/models/Bootcamps")

// @desc    Get courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamp/:bootcampId/courses
// @access    Public

exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

    if (req.params.bootcampId) {
      query = Course.find({ bootcamp: req.params.bootcampId });
    } else {
      query = Course.find().populate({
        path:'bootcamp',
        select: 'name description'
      }); // inject tat ca cac field trong bootcamp vao cai course (truoc do chi co id bootcamp)
    }
  
    const courses = await query;
    res
      .status(200)
      .json({ success: true, count: courses.length, data: courses });
});


// @desc    Get single course
// @route   GET /api/v1/courses/:id
// @access    Public

exports.getCourse= asyncHandler(async (req, res, next) => {
  
  let course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
  });

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: course,
  })
});

// @desc    Add course
// @route   POST /api/v1/bootcamps/:bootcampId/courses/
// @access  Private

exports.addCourse= asyncHandler(async (req, res, next) => {
  
  req.body.bootcamp = req.params.bootcampId;
  // req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if(!bootcamp){
    return next(
      new ErrorResponse(`No bootcamp with the ${req.params.bootcampId}`), 404
    )
  }

  const course = await Course.create(req.body);
  res.status(200).json({
    success: true,
    data:bootcamp,
  })
});



// @desc    Update course
// @route   PUT /api/v1/courses/:id
// @access  Private

exports.updateCourse = asyncHandler(async (req, res, next) => {
  
  let course = await Course.findById(req.params.id);

  if(!course){
    return next(
      new ErrorResponse(`No course with the ${req.params.id}`)
    )
  }

  course = await Course.findByIdAndUpdate(req.params.id ,req.body,{
    runValidators: true,
    new: true
  });
  res.status(200).json({
    success: true,
    data:course,
  })
});

// @desc    Delete course
// @route   DELETE /api/v1/courses/:id
// @access  Private

exports.deleteCourse = asyncHandler(async (req, res, next) => {
  
  let course = await Course.findById(req.params.id);

  if(!course){
    return next(
      new ErrorResponse(`No course with the ${req.params.id}`)
    )
  }

  await course.remove();
  res.status(200).json({
    success: true,
    data:{},
  })
});