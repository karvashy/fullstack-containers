const bcrypt = require('bcrypt') 
const usersRouter = require('express').Router()
const logger = require('../utils/logger')
const User = require('../models/user')

usersRouter.get('/',async (request,response, next) => {
    try{
        const users = await User.find({}).populate('blogs')
        if(users.length > 0){
            response.status(200).json(users)
        }
        else{
            response.status(404).send('No users found')
        }
    }
    catch(exception){
        next(exception)
    }
})

usersRouter.post('/',async (request,response,next) => {
    const {username, password} = request.body

    if(!username || !password){
        response.status(400).json({"error":"Username and password must be present"})
    }
    else if(username.length > 2 && password.length > 2){
        try{
            const saltRounds = 10
            const passwordHash = await bcrypt.hash(password, saltRounds)
            const userObject = {username, passwordHash}
            const user = new User(userObject)
            const savedUser = await user.save()
            response.status(201).json(savedUser)
            logger.info("User with username",username,"was created")
        }
        catch(exception){
            response.status(400).json({"error":exception._message})
            next(exception)
        }
    }
    else{
        response.status(400).json({"error": "Username and password should be atleast 3 characters in length"})
    }
})

module.exports = usersRouter
