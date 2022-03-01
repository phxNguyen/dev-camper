const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) =>{
  
  let error = { ...err};
  error.message = err.message;
  
  console.log(err);


  // Khong tim thay Mongoose ObjectID
  if(err.name === 'CastError'){
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404)
  }

  ///Khi key bi trung` (trung` name)
  if(err.code === 11000 ){
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 404)
  }

   // response server bi loi
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });


  
  
}

module.exports = errorHandler;