const express = require("express");
const router = express.Router();

const {getAllJobs, getJob, createJob, deleteJob, updateJob} = require('../controllers/jobs')

router.route('/').post(createJob).get(getAllJobs);
router.route('/:id').delete(deleteJob).patch(updateJob).get(getJob)

module.exports = router