const helper = require('./test_helper')
const listHelper = require('../utils/list_helper')

const blogs = helper.blogs 
const listWithOneBlog = helper.listWithOneBlog

test('dummy function test', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

describe("total likes", () => {
    test("calculate total likes for one blog", () => {
        const result = listHelper.totalLikes(listWithOneBlog)    
        expect(result).toBe(5)
    })
    test("calculate total likes for lot of blogs", () => {
        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(36)
    })
    test('calculate total likes on no blogs', () => {
        const blogs = []

        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(0)
    })
})

describe("favorite blog", () => {
    test('calculate fav blog for on blog', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)
        expect(result).toEqual(listWithOneBlog[0])

    })
    test('calculate fav blog for many blogs', () => {
        const result = listHelper.favoriteBlog(blogs)
        expect(result).toEqual(blogs[2])
    })
    test('calculate fav blog for no blogs', () => {
        const result = listHelper.favoriteBlog([])
        expect(result).toEqual({})
    })
})

describe("writeen most blogs", () => {
    test('calculate author who wrote most blogs for one blog', () => {
        const result = listHelper.mostBlogs(listWithOneBlog)
        expect(result).toEqual({"author": listWithOneBlog[0]["author"], "blogs": 1})
    })
    test('calculate author who wrote most blogs for many blogs', () => {
        const result = listHelper.mostBlogs(blogs)
        expect(result).toEqual({"author": blogs[3]["author"], "blogs": 3})
    })

})

describe("max liked blog author", () => {
    test('calculate author who has most likes for one blog', () => {
        const result = listHelper.mostLikes(listWithOneBlog)
        expect(result).toEqual({"author": listWithOneBlog[0]["author"], "likes": 5})
    })
    test('calculate author who has most likes for many blogs', () => {
        const result = listHelper.mostLikes(blogs)
        expect(result).toEqual({"author": blogs[1]["author"], "likes": 17})
    })

})
