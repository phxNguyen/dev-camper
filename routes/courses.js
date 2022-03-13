const express = require('express');
const router = express.Router({mergeParams: true});
const Course = require('../database/models/Course');
const {getCourses, getCourse, addCourse, updateCourse,deleteCourse}   = require('../controllers/course');
const advancedResults = require('../middleware/advancedResults');
const {protect, authorize} = require('../middleware/auth')

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
  .post(protect,authorize('publisher','admin'), addCourse)
  .put(protect,authorize('publisher','admin'), updateCourse)
  .delete(protect,authorize('publisher','admin'), deleteCourse)
  

module.exports = router;

