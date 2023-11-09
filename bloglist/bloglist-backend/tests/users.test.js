const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const logger = require('../utils/logger')

// TODO: Some weird bug leading to the connection to mongoose database twice. Fix that!
const api = supertest(app)
describe("User: testing the login functionality", () => {

    beforeAll(async () => {
        await User.deleteMany({})
    }, 20000);

    test("User: testing the username.length < 3 case",async () => {
        const newUser = {username: "te",password: "test"}
        const response = await api.post("/api/users")
        .send(newUser)
        .expect(400)

        expect(response.body).toMatchObject({"error":"Username and password should be atleast 3 characters in length"})
    });

    test("User: testing the password.length < 3 case",async () => {
        const newUser = {username: "test1",password: "te"}
        const response = await api.post("/api/users")
        .send(newUser)
        .expect(400)

        expect(response.body).toMatchObject({"error":"Username and password should be atleast 3 characters in length"})
    });

    test("User: testing the unique username case",async () => {
        const newUser = {username: "test",password: "test"}
        const response = await api.post("/api/users").send(newUser)
        const responseNew = await api.post("/api/users")
        .send(newUser)
        .expect(400)

        expect(responseNew.body).toMatchObject({"error": "User validation failed"})
    });

    test("User: testing the  no username case",async () => {
        const newUser = {password: "test"}
        const response = await api.post("/api/users")
        .send(newUser)
        .expect(400)

        //expect(response.body).toMatchObject({username: newUser.username, blogs: []})
        expect(response.body).toMatchObject({"error": "Username and password must be present"})
    });

    test("User: testing the  no password case",async () => {
        const newUser = {username: "test"}
        const response = await api.post("/api/users")
        .send(newUser)
        .expect(400)

        expect(response.body).toMatchObject({"error": "Username and password must be present"})
    });

    test('User: creating new valid users', async () => {
        const newUser = {username: "test",password: "test"}
        const response = await api.post("/api/users")
        .send(newUser)
        .expect(201)

        expect(response.body).toMatchObject({username: newUser.username, blogs: []})
    });
    test("User: getting all users", async () => {
            const newUser = {username: "test",password: "test"}
            const response = await api.post("/api/users")
            .send(newUser)
           const responseNew =  await api.get('/api/users')
            .expect(200)
            .expect('Content-Type',/application\/json/)

            const users = await helper.getAllUsers()
            expect(responseNew.body).toEqual(users)
    });

    afterEach(async () => {
        await User.deleteMany({})
    }, 20000);

})

describe("UserAuth: testing blog functions from a logged in account", () => {
    beforeEach(async () => {
        const test = await api.post('/api/users').send({"username":"test","password":"test"})
        const newUser = {username: "test",password: "test"}
        const response = await api.post("/api/login").send(newUser)
        const blogResponse = await api.get("/api/blogs")
        const selectedBlog = blogResponse.body[blogResponse.body.length - 1]
        const createBlog = await api.post('/api/blogs').set({'Authorization': "Bearer "+response.body.token}).send({...selectedBlog, user: response.body.id})
    }, 20000);

    test("UserAuth: testing  blog creation based on user token", async () => {
        const login = await api.post('/api/login')
        .send({username: "test", password: "test"})
        const token = login.body.token
        const id = login.body.id
        const response = await api.post('/api/blogs')
        .set({'Authorization':'Bearer '+token})
        .send({"title":"test", "author":"test", "user": id, "url":"testing.com", "likes":5})
        .expect(201)
    },30000);

    test("UserAuth: testing  blog creation without user token", async () => {
        const login = await api.post('/api/login')
        .send({username: "test", password: "test"})
        const token = login.body.token
        const id = login.body.id
        const response = await api.post('/api/blogs')
        .send({"title":"test", "author":"test", "user": id, "url":"testing.com", "likes":5})
        .expect(401)
    },30000);


    test("UserAuth: testing  blog deletion based on user token", async () => {
        const login = await api.post('/api/login')
        .send({username: "test", password: "test"})
        const token = login.body.token
        console.log("userauth test token", token, "login body:",login.body)
        const userId = login.body.id
        const blogResponse = await api.get('/api/blogs')
        const selectedBlog = blogResponse.body[blogResponse.body.length - 1]
        const response = await api.delete(`/api/blogs/${selectedBlog.id}`)
        .set({'Authorization':'Bearer '+token})
        .expect(204)
    });

    test("UserAuth: testing  blog deletion without user token", async () => {
        const login = await api.post('/api/login')
        .send({username: "test", password: "test"})
        const token = login.body.token
        const userId = login.body.id
        const blogResponse = await api.get('/api/blogs')
        const selectedBlog = blogResponse.body[blogResponse.body.length - 1]
        const response = await api.delete(`/api/blogs/${selectedBlog.id}`)
        .expect(401)
    });


    test("testing the missing case of likes", async () => {
        const login = await api.post('/api/login')
        .send({username: "test", password: "test"})
        const token = login.body.token
        const id = login.body.id
        const blog = helper.listWithOneBlog[0]
        delete blog._id
        delete blog.likes
        const response = await api.post('/api/blogs')
        .set({'Authorization':'Bearer '+token})
        .send({"title":"test", "author":"test", "user": id, "url":"testing.com"})
        .expect(201)

        expect(response.body.likes).toBe(0)
    }, 25000);

})

afterAll(async () => {
    await mongoose.connection.close()
})
