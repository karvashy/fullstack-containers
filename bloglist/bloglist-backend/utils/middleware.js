const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const tokenExtractor = (request, reponse, next) => {
    const authorization = request.get('authorization')
    if(authorization && authorization.startsWith('Bearer')){
        const token = authorization.replace('Bearer ','')
        request.token = token
    }
    next()
}

const userExtractor = async (request, response, next) => {
    if(request.token){
        let decodedToken;
        try{
            decodedToken = await jwt.verify(request.token, process.env.SECRET)
            console.log("decodetoken in userExtractor",decodedToken)
        }
        catch(exception){
            logger.error("exception in middleware during decoding jwt",exception)
            next(exception)
        }
        let user;
        try{
            user = await User.findById(decodedToken.id)
            console.log("user in userExtractor",user)
        }
        catch(exception){
            logger.error("exception in middle while finding the user by id",exception)
            next(exception)
        }
        if(user){
            request.user = user
        }
    }
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).json({"error":"unknown endpoint"})
}

const errorHandler = (error, request, response, next) => {
    if(error.name === 'JsonWebTokenError'){
        logger.error("jsonwebtokenerror",error.message)
        return response.status(403).json({"error":error.message})
    }
    next()
}

module.exports = {tokenExtractor, userExtractor, unknownEndpoint, errorHandler}
