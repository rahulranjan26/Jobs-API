const Job = require('../models/Job')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')

const getAllJobs = async (req, res) => {
    const jobs = await Job.find({createdBy: req.user.userId}).sort('createdAt');
    res.status(StatusCodes.OK).json({jobs, count: jobs.length})
}

const getJob = async (req, res) => {
    const {user: {userId}, params: {id: jobId}} = req
    // console.log(req.body)
    const job = await Job.findOne({
        _id: jobId,
        createdBy: userId
    })
    if (!job) {
        throw new NotFoundError(`Job with Id:${userId} not present`)
    }
    res.status(StatusCodes.OK).json({job})

}
const updateJob = async (req, res) => {
    const {user: {userId}, params: {id: jobId}} = req
    const {company, position} = req.body;
    if (!company || !position) {
        throw new BadRequestError("The company or position is missing")
    }
    const job = await Job.findByIdAndUpdate({
        _id: jobId,
        createdBy: userId
    }, req.body, {new: true, runValidators: true},)
    res.status(StatusCodes.OK).json({job})
}


const deleteJob = async (req, res) => {
    const {user: {userId}, params: {id: jobId}} = req;
    const job = await Job.findByIdAndRemove({
        _id: jobId,
        createdBy: userId
    })
    if (!job) {
        throw new NotFoundError("The job with Id do not exist")
    }
    res.status(StatusCodes.OK).json()
}

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({job})
}
module.exports = {
    getAllJobs,
    getJob,
    updateJob,
    deleteJob,
    createJob
}
