const express = require('express');
const router = express.Router({mergeParams: true});
const Course = require('../database/models/Course');
const {getCourses, getCourse, addCourse, updateCourse,deleteCourse}   = require('../controllers/course');
const advancedResults = require('../middleware/advancedResults');

router
  .route('/')
  .get(advancedResults(Course,{
    path:'bootcamp',
    select: 'name description'
  }),getCourses)
  .post(addCourse);
  
router
  .route('/:id')
  .get(getCourse)
  .post(addCourse)
  .put(updateCourse)
  .delete(deleteCourse)
  

module.exports = router;

