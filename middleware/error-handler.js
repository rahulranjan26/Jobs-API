const {CustomAPIError} = require("../errors");
const {StatusCodes} = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
    const customErr = {
        message: err.message || "Something went wrong",
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    }
    if (err instanceof CustomAPIError) {
        return res.status(err.statusCode).json({msg: err.message});
    }

    if (err.code && err.code === 11000) {
        customErr.message = `Duplicate value Entered ${Object.keys(err.keyValue)}`
        customErr.statusCode = 400
    }

    if (err.name === 'ValidationError') {
        customErr.message = Object.values(err.errors).map((item) => item.message).join(',')
        customErr.statusCode = 400
    }

    if (err.name === 'CastError') {
        customErr.message = `No item found with id:${err.value}`
        customErr.statusCode = 404
    }

    return res.status(customErr.statusCode).json({msg: customErr.message});
    // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err});
};

module.exports = errorHandlerMiddleware;
