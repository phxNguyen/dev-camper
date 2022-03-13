const express = require("express");
const router = express.Router();
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps");

const { protect } = require("../middleware/auth");

const advancedResults = require("../middleware/advancedResults");
const Bootcamp = require("../database/models/Bootcamps");
// Include other resource routers
const courseRouter = require("./courses");

// Re-route into other resource routers, forwarding
router.use("/:bootcampId/courses", courseRouter);

//Upload photo
router.route("/:id/photo").put(protect, bootcampPhotoUpload);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, updateBootcamp)
  .delete(protect, deleteBootcamp);

module.exports = router;
