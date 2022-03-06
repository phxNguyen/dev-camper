const mongoose = require("mongoose");
const Course = require('./Course')
const slugify = require("slugify");
const geocoder = require("../../utils/geocoder");

const BootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add name"],
    unique: true,
    trim: true,
    maxlength: [50, "Name cannot be more than 50 characters "],
  },
  slug: String,
  description: {
    type: String,
    required: [true, "Please add description"],
    trim: true,
    maxlength: [500, "Description cannot be more than 500 characters"],
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      "Please use a valid  URL  with HTTP or HTTPs",
    ],
  },
  phone: {
    type: String,
    maxlength: [20, "Phone number cannot be more than 20 characters"],
  },
  email: {
    type: String,
    match: [
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      ,
      "Please use a valid email",
    ],
  },
  address: {
    type: String,
    required: [true, "Please use address"],
    trim: true,
  },
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  careers: {
    // Array of strings
    type: [String],
    required: true,
    enum: [
      "Web Development",
      "Mobile Development",
      "UI/UX",
      "Data Science",
      "Business",
      "Other",
    ],
  },
  averageRating: {
    type: Number,
    min: [1, "Rating must be at least 1"],
    max: [10, "Rating must can not be more than 10"],
  },
  averageCost: Number,
  photo: {
    type: String,
    default: "no-photo.jpg",
  },
  housing: {
    type: Boolean,
    default: false,
  },
  jobAssistance: {
    type: Boolean,
    default: false,
  },
  jobGuarantee: {
    type: Boolean,
    default: false,
  },
  acceptGi: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
},
  //virtual populate
  {
  toJSON: {virtuals:true},
  toObject: {virtuals: true}
});

// create bootcamp slug
BootcampSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Cascade delete
BootcampSchema.pre('remove', async function(next){
  console.log(`Courses da bi xoa ${this._id}`);
  await this.model('Course').deleteMany({bootcamp: this._id});
  next();
})

//Geocode & create location field
BootcampSchema.pre("save", async function (next) {
  const location = await geocoder.geocode(this.address);
  this.location = {
    type: "Point",
    coordinates: [location[0].longitude, location[0].latitude],
    formattedAddress: location[0].formattedAddress,
    street: location[0].streetName,
    city: location[0].city,
    state: location[0].stateCode,
    zipcode: location[0].zipcode,
    country: location[0].countryCode,
  };
  //do not save address in db
  this.address = undefined;
  next();
});

// Reverse populate with virtuals
// src ref: https://mongoosejs.com/docs/tutorials/virtuals.html 
// keyword: populate 
BootcampSchema.virtual('courses',{
  ref: 'Course', //ref to model
  localField:'_id',
  foreignField:'bootcamp',
  justOne: false
})
module.exports = mongoose.model('Bootcamp', BootcampSchema);
