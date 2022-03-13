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

const { protect, authorize} = require("../middleware/auth");

const advancedResults = require("../middleware/advancedResults");
const Bootcamp = require("../database/models/Bootcamps");
// Include other resource routers
const courseRouter = require("./courses");

// Re-route into other resource routers, forwarding
router.use("/:bootcampId/courses", courseRouter);

//Upload photo
router
  .route("/:id/photo")
  .put(protect, authorize('publisher','admin'),bootcampPhotoUpload);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect,authorize('publisher','admin'), createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorize('publisher','admin'),  updateBootcamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

module.exports = router;
