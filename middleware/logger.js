//@desc   Ghi lai Logs request vao console
//@desc   Logs request to console
const logger = (req,res,next)=>{
  console.log(
    `${req.method} ${req.protocol}://${req.get('host')} ${req.originalUrl}` 
  );
  next();
}


module.exports = logger;