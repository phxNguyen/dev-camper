const express = require('express');
const router = express.Router({mergeParams: true});
const Course = require('../database/models/Course');
const {getCourses, getCourse, addCourse, updateCourse,deleteCourse}   = require('../controllers/course');
const advancedResults = require('../middleware/advancedResults');
const {protect} = require('../middleware/auth')

router
  .route('/')
  .get(advancedResults(Course,{
    path:'bootcamp',
    select: 'name description'
  }),getCourses)
  .post(protect, addCourse);
  
router
  .route('/:id')
  .get(getCourse)
  .post(addCourse)
  .put(protect, updateCourse)
  .delete(protect, deleteCourse)
  

module.exports = router;

