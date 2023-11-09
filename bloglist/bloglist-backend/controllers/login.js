const loginRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')



loginRouter.post('/', async (request, response, next) => {
    const {username, password} = request.body
    const user = await User.findOne({username})
    const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password,user.passwordHash)

    if(!(user && passwordCorrect)){
        return response.status(401).json({"error":"Invalid username or password"})
    }
    const userForToken = {
        username: user.username,
        id: user._id
    }
    const token = jwt.sign(userForToken,process.env.SECRET)
    response.status(200).send({token, username,id:user._id})
});

module.exports = loginRouter
