const Bootcamps = require('../database/models/Bootcamps');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access    Public
exports.getBootcamps = async(req,res,next)=>{
  try{
    const bootcamps = await Bootcamps.find();
    res.status(200).json({success:true, count:bootcamps.length, data:bootcamps})
  }catch(err){
    res.status(400).json({success: false})
  }
}

// @desc    Get single bootcamps
// @route   GET /api/v1/bootcamps/:id
// @access  Private

exports.getBootcamp = async(req,res,next)=>{
  
  try{
    const bootcamp = await Bootcamps.findById(req.params.id)
    if(!bootcamp){
      return res.status(400).json({success:false})
    }
    res.status(200).json({success:true,data:bootcamp})
  }catch(err){
    //res.status(400).json({success:false})
    next(err);
  }
  
  
}

// @desc    Create new bootcamps
// @route   POST /api/v1/bootcamps/
// @access  Private

exports.createBootcamp = async(req,res,next)=>{
 try{ const bootcamp = await Bootcamps.create(req.body);
  res.status(201).json({success:true, data:bootcamp})}
  catch(err){
    res.status(400).json({success:false})
  }
}

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private

exports.updateBootcamp = async(req,res,next)=>{
  try{
    const bootcamp = await Bootcamps.findByIdAndUpdate(req.params.id, req.body,{
      new: true,
      runValidators: true
    })

    if(!bootcamp){
      return res.status(400).json({success: false})
    }

    res.status(200).json({success: true, data: bootcamp})
  }catch(err){
    res.status(400).json({success:false})
  }
}

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private

exports.deleteBootcamp = async(req,res,next)=>{
  try{
    const bootcamp = await Bootcamps.findByIdAndDelete(req.params.id)

    if(!bootcamp){
      return res.status(400).json({success: false})
    }

    res.status(200).json({success: true, data: {}})
  }catch(err){
    res.status(400).json({success:false})
  }
}