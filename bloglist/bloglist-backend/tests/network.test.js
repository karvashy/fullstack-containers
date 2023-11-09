const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    for(let blog of helper.blogs){
        let blogObject = new Blog(blog)
        await blogObject.save()
    }
}, 20000);
describe("testing get requests",() => {

    test("testing get routes", async () => {
        const response = await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type',/application\/json/)

        expect(response.body).toHaveLength(helper.blogs.length)
    }, 25000);

    test("testing get blogs based on id", async () => {
        const firstBlog = helper.blogs[0]
        const response = await api.get(`/api/blogs/${firstBlog._id}`)
        .expect(200)
        .expect('Content-Type',/application\/json/)

        const testingObj = helper.blogs[0]
        testingObj.id = firstBlog._id
        delete testingObj._id
        delete testingObj.__v
        expect(response.body).toStrictEqual(testingObj)
    }, 25000);

    test("testing the presense of id", async () => {
        const response = await api.get('/api/blogs')
        if(response.body.length > 0){
            for(let blog of response.body){
                expect(blog["id"]).toBeDefined()
            }
        }
    });
})

describe("testing post requests", () => {
    test('testing missing title and url' ,async () => {
        const blog = helper.listWithOneBlog[0]
        delete blog._id
        delete blog.author
        delete blog.url
        const response = await api.post('/api/blogs')
        .send(blog)
        .expect(400)
    });
})
/*
describe("testing put method", () => {
    test("testing updating a single blog post", async () => {
        const response = await api.get('/api/blogs')
        const onBlog = response.body[0]
        const resp = await api.put(`/api/blogs/${onBlog.id}`)
        .send(onBlog)
        .expect(200)

        expect(resp.body).toStrictEqual(onBlog)
    })

});
*/

afterAll(() => {
    mongoose.connection.close()
})
