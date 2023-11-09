const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response,next) => {
    try{
        const blogs = await Blog.find({}).populate({
            path:'user',populate: {
                path:'blogs'}})
        //const testBlog = await blogs.populate('user.blogs')
        //console.log('blogs[1].user after populating the user.blogs array',blogs[1].user.blogs)
        //console.log('testblog.user after populating',testBlog.user)
        response.json(blogs).end()
    }
    catch(exception){
      logger.error("error in GET /api/blogs",exception)
      next(exception)
    }
});

blogsRouter.post('/', async (request, response,next) => {
    const body = request.body
    if(!body.author || !body.title){
        return response.status(400).json({"error":"Request should have author and title fields"});
    }
    let decodedToken;
    let user;
    if(request.get('authorization')){
        try {
            //user = await request.user
            user = await request.user
        }
        catch(exception){
            logger.error("jsonwebtoken error",exception)
            return response.status(401).json({"error":'token invalid'})
        }
    }
    else{
        return response.status(401).json({"error":"Unauthorized"})
    }
    if(!user){
        return response.status(401).json({"error":'token invalid'})
    }
    const blog = {"title":body.title, 
        "author":body.author, 
        "user": user._id, 
        "url": body.url, 
        "likes": request.body.likes ? request.body.likes : 0
    }
    try{
        const blogObject = new Blog(blog)
        let result = await blogObject.save()
        const blogId = result._id
        const newUser = await User.findById(user._id)
        const userDoc = {username: newUser.username, passwordHash: newUser.passwordHash, blogs: newUser.blogs}
        console.log('userDoc',userDoc)
        userDoc['blogs'].push(blogId.toString())
        const updatedUser = await User.findByIdAndUpdate(user,userDoc,{new: true, runValidators: true, context: 'query'})
        console.log('updatedUser while post', updatedUser)
        response.status(201).json(result)
    }
    catch(exception){
        logger.error("error in POST /api/blogs",exception)
        next(exception)
    }
});

blogsRouter.get('/:id', async (request,response,next) => {
    try{
        const result = await Blog.findById(request.params.id).populate('user')
        if(result){
            response.status(200).json(result)
        }
        else{
            return response.status(404).end()
        }
    }
    catch(exception){
        logger.error("exception inside get blogs based on id", exception)
        next(exception)
    }
});

blogsRouter.put('/:id', async (request, response,next) => {
    const blog = (request.body)
    if(!request.body.likes){
        blog.likes = 1
    }
    if(!request.body.author || !request.body.title){
        return response.status(400).end()
    }
    try{
        const result = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true, runValidators: true, context: 'query'}).populate('user')
        response.status(200).json(result)
    }
    catch(exception){
        logger.error(`error in PUT /api/blogs/${request.params.id}`,exception)
        next(exception)
    }
});

blogsRouter.delete('/:id', async (request,response,next) => {
    const blogId = request.params.id
    const blog = await Blog.findById(blogId).populate('user')
    if(blog && blog.user && request.token){
        const userObject = await jwt.verify(request.token, process.env.SECRET)
        //logger.error("comparisons during delete blog.user and userobject",blog.user, userObject)
        if(blog.user._id.toString() === userObject.id){
            try{
                const userId = userObject.id
                const getUser = await User.findById(userId)
                const updateUser = {username: getUser.username, passwordHash: getUser.passwordHash, blogs: getUser.blogs}
                console.log('updateUser in delele',updateUser)
                updateUser['blogs'] = updateUser['blogs'].filter(blog => blog._id.toString() !== blogId)
                console.log('updateUser[blogs]', updateUser['blogs'])
                const newUser = await User.findByIdAndUpdate(userId,updateUser, {new: true, runValidators: true, context: 'query'})
                console.log('new user after deleting the blog in it',newUser)
                const result = await Blog.findByIdAndRemove(blogId)
                response.status(204).end()
            }
            catch(exception){
                logger.error(`error in DELETE /api/blogs/${request.params.id}`,exception)
                next(exception)
            }
        }
        else{
            response.status(403).json({"error":"You are not allowed to delete the blogpost"})
        }
    }
    else{
        //logger.error("blog and request.token",blog,request.token)
        if(!blog){
            console.log("blog not found while deleting")
            response.status(500).json({"error":"Something wrong!"})
            return
        }
        response.status(401).json({"error":"Unauthorized"})
    }
});
 module.exports = blogsRouter 
