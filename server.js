const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./database/dbConnection')
//loading env config
dotenv.config({ path: './config/config.env' });
const app = express();

// Connect to DB
connectDB();
//Route files
const bootcamps = require('./routes/bootcamps');

//Logger files
const logger = require('./middleware/logger');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// su dung router
app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(
    `listening on port ${process.env.PORT} in ${process.env.NODE_ENV}`
  );
});


//=======Cai nay dung` lai server khi gap loi, nguyen ly hoat dong thi ntn chua biet :P ========//

process





