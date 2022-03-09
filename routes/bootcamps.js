const express = require('express');
const router = express.Router();
const {getBootcamps, 
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,bootcampPhotoUpload}   = require('../controllers/bootcamps')


  const advancedResults = require('../middleware/advancedResults')
  const Bootcamp = require('../database/models/Bootcamps')
// Include other resource routers
const courseRouter = require('./courses');

// Re-route into other resource routers, fowarding
router.use('/:bootcampId/courses', courseRouter);

//Upload photo
router.route('/:id/photo').put(bootcampPhotoUpload);

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'),getBootcamps)
  .post(createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);


module.exports = router;