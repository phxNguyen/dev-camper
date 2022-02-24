<<<<<<< HEAD
const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) =>{
  
  let error = { ...err};
  error.message = err.message;
  
  console.log(err.stack);


  // Khong tim thay Mongoose ObjectID
  if(err.name === 'CastError'){
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404)
  }
   
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
=======
const errorHandler = (err, req, res, next) =>{
  console.log(err.stack);
  res.status(500).json({
    success: false,
    error: err.message
>>>>>>> dbc5554f83284a9ebe7236917c703869c963a602
  });
}

module.exports = errorHandler;