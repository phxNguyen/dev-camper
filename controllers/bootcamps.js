const path = require("path");
const Bootcamps = require("../database/models/Bootcamps");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access    Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
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
  // add user to req.body
  // req.user.id la tu client
  // req.body.user la tu middleware
  console.log(req.body.user);
  console.log(req.user.id);
  req.body.user = req.user.id;

  // Tim id trong bootcamp
  const  publishedBootcamp =  await Bootcamps.findOne({user: req.user.id}) ;
  if(publishedBootcamp && req.user.role !== 'admin'){
    return next(
      new ErrorResponse(`The user with id ${req.user.id} has already published a bootcamp`, 400)
    )
  }

  const bootcamp = await Bootcamps.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamps.findById(req.params.id);

  if (!bootcamp) {
    next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  // Make sure user is bootcamp owner 
  if(bootcamp.user.toString() !== req.user.id & req.user.role !== 'admin'){
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to update`, 401)
    )
  }
  bootcamp = await Bootcamps.findById(req.params.id, req.body ,{
    new: true,
    runValidators: true,
  })
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

  // Make sure user is bootcamp owner 
  if(bootcamp.user.toString() !== req.user.id & req.user.role !== 'admin'){
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to delete  `, 401)
    )
  }
  bootcamp = await Bootcamps.findById(req.params.id, req.body ,{
    new: true,
    runValidators: true,
  })
  bootcamp.remove(); // trigger cascade delete middleware
  res.status(200).json({ success: true, data: {} });
});

// @desc    Upload photo for bootcamp
// @route   PUT /api/v1/bootcamps/:id/photo
// @access  Private

exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamps.findById(req.params.id);

  if (!bootcamp) {
    next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is bootcamp owner 
  if(bootcamp.user.toString() !== req.user.id & req.user.role !== 'admin'){
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to update  `, 401)
    )
  }
  bootcamp = await Bootcamps.findById(req.params.id, req.body ,{
    new: true,
    runValidators: true,
  })

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`; 

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
    
    await Bootcamps.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
