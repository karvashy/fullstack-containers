const dummy = (blogs) => {
    return 1
}
const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => {
        return blog.likes + sum
    },0)

}

const favoriteBlog = (blogs) => {
    if(blogs.length === 0){
        return {}
    }
    const maxLikesObj =  blogs.reduce((favObject, blog,currentIndex)=> {
        return blog.likes > favObject.maxLikes 
        ? {maxIndex: currentIndex, maxLikes: blog.likes}
        : favObject
    },{maxIndex:0,maxLikes:0})
    return blogs[maxLikesObj.maxIndex]
}

const mostBlogs = (blogs) => {
    if(blogs.length === 0){
        return {}
    }
    const totalAuthors = []
    blogs.map((blog) => {
        const index = totalAuthors.findIndex(author => author["author"] === blog["author"])
        if(index === -1){
            totalAuthors.push({"author": blog["author"], "blogs": 1})
        }
        else{
            totalAuthors[index]["blogs"]++
        }
    })
    return totalAuthors.reduce((maxAuthor, author) => {
        return maxAuthor["blogs"] > author["blogs"]
                ? maxAuthor
                : author
    }, totalAuthors[0]) 
}

const mostLikes = (blogs) => {
    if(blogs.length === 0){
        return {}
    }
    const totalAuthors = []
    blogs.map((blog) => {
        const index = totalAuthors.findIndex(author => author["author"] === blog["author"])
        if(index === -1){
            totalAuthors.push({"author": blog["author"], "likes": blog["likes"]})
        }
        else{
            totalAuthors[index]["likes"] += blog["likes"]
        }
    })
    return totalAuthors.reduce((maxAuthor, author) => {
        return maxAuthor["likes"] > author["likes"]
                ? maxAuthor
                : author
    }, totalAuthors[0]) 
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}

