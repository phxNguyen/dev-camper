const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

//Load model
const Bootcamp = require("./database/models/Bootcamps");
const Course = require("./database/models/Course");
const User = require("./database/models/User");
//load env
dotenv.config({ path: "./config/config.env" });

// connect Mongo DB

try {
  let connectionOptions = {
    user: process.env.USER,
    pass: process.env.PASSWORD,
    dbName: process.env.DB,
  };
  dbConnection = mongoose.connect(process.env.MONGODB_URI, connectionOptions);
  console.log(`MongoDB Connected `);
} catch (err) {
  console.error(err);
}

// read JSON files
const bootcampsData = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);
const coursesData = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);
const usersData = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);
// Import into DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcampsData);
    await Course.create(coursesData);
    await User.create(usersData);
    console.log("Data Imported...");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete DB
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    console.log("Data Deleted...");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
