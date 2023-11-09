const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')

mongoose.set('strictQuery',false)
logger.info("connecting to",config.MONGODB_URL)
mongoose.connect(config.MONGODB_URL)
    .then(() => logger.info("connected to the database"))
    .catch((error) => logger.error("error in connecting with the database", error))

app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use('/api/blogs',middleware.userExtractor,blogsRouter)
app.use('/api/users',usersRouter)
app.use('/api/login',loginRouter)
if(process.env.NODE_ENV === "test"){
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing',testingRouter)
}
app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

module.exports = app
