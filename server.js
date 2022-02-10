const express = require('express');
const dotenv = require('dotenv');

//Route files
const bootcamps = require('./routes/bootcamps')

//loading env config
dotenv.config({ path: './config/config.env' });
const app = express();

// su dung router
app.use('/api/v1/bootcamps',bootcamps)

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(
    `listening on port ${process.env.PORT} in ${process.env.NODE_ENV}`
  );
});
