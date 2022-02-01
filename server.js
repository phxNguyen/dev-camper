const express = require('express');
const dotenv = require('dotenv');

//loading env config
dotenv.config({ path: './config/config.env' });
const app = express();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(
    `listening on port ${process.env.PORT} in ${process.env.NODE_ENV}`
  );
});
