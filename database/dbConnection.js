const mongoose = require('mongoose');

const getDBConnection = async () => {
  try {
    let connectionOptions = {
      user: process.env.USER,
      pass: process.env.PASSWORD,
      dbName: process.env.DB,
    };

    const dbConnection = await mongoose.connect(
      process.env.MONGODB_URI,
      connectionOptions, 
    );
    console.log(`MongoDB Connected `);
  } catch (err) {
    console.error(err);
    
  }
  
};

module.exports = getDBConnection;
