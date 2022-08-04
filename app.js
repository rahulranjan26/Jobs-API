require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

// DB connection
const connectDB = require('./db/connect')

// Router
const authRouter = require('./routes/auth')
const jobRouter = require('./routes/jobs')

//Authorization Middleware
const auth = require('./middleware/authentication')


// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

//Security packages
const helmet = require('helmet');
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')


app.use(rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 Minutes
    max: 100 // Limit each IP to 100 requests per window
}))
app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(xss())

//Testing route
// app.use('/', (req, res) => {
//     res.send("In Jobs API ")
// })


// routes

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', auth, jobRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();
