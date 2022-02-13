const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

//loading env config
dotenv.config({ path: './config/config.env' });
const app = express();

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



TESTING 