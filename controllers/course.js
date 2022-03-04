const Course = require("../database/models/Course");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc    Get courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamp/:bootcampId/courses
// @access    Public

exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  try{
    if (req.params.bootcampId) {
      query = Course.find({ bootcamp: req.params.bootcampId });
    } else {
      query = Course.find().populate({
        path:'bootcamp',
        select: 'name, description'
      }); // inject tat ca cac field trong bootcamp vao cai course (truoc do chi co id bootcamp)
    }
  
    const courses = await query;
    res
      .status(200)
      .json({ success: true, count: courses.length, data: courses });
  }catch(err){
    console.error(err);
  }
});
