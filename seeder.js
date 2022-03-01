const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Bootcamp = require('./database/models/Bootcamps');

//load env 
dotenv.config({path:'./config/config.env'});

// connect Mongo DB

  try {
    let connectionOptions = {
      user: process.env.USER,
      pass: process.env.PASSWORD,
      dbName: process.env.DB,
    };
    dbConnection =  mongoose.connect(
      process.env.MONGODB_URI,
      connectionOptions, 
    );
    console.log(`MongoDB Connected `);
  } catch (err) {
    console.error(err); 
  }
  

// read JSON files
const bootcampsData = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'))

// Import into DB
const importData = async()=>{
  try{
    await Bootcamp.create(bootcampsData);
    console.log('Data Imported...');
    process.exit();
  }catch(err){
    console.error(err);
  }
}

// Delete DB
const deleteData = async()=>{
  try{
    await Bootcamp.deleteMany();
    console.log('Data Deleted...');
    process.exit();
  }catch(err){
    console.error(err);
  }
}

if(process.argv[2] === '-i'){
  importData();
}else if(process.argv[2] === '-d'){
  deleteData();
}