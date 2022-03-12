const path = require("path");
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const fileupload = require('express-fileupload')
const connectDB = require('./database/dbConnection')
const errorHandler = require('./middleware/error')
const cookieParser = require('cookie-parser')
//loading env config
dotenv.config({ path: './config/config.env' });


const app = express()
// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Connect to DB
connectDB();

//Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth.js')
//Logger files
const logger = require('./middleware/logger');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File upload
app.use(fileupload());
app.use("/images", express.static(path.join(__dirname, "public/uploads")));

// su dung router
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth',auth)

// error handler
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(
    `listening on port ${process.env.PORT} in ${process.env.NODE_ENV}`
  );
});


//=======Cai nay dung` lai server khi gap loi, nguyen ly hoat dong thi ntn chua biet :P ========//






