import { useState } from 'react'
import blogService from '../services/blogs'

const BlogLikes = ({ blogLikes, likeHandler }) => {
    return (<p className="blogLikes">likes {blogLikes}<button onClick={likeHandler}>like</button></p>)
}

const Blog = ({ blog,user }) => {
    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5

    }
    const [view,setView] = useState(false)
    const [blogLikes, setBlogLikes] = useState(blog.likes)
    const viewHandler = () => {
        setView(!view)
    }
    //console.log('blog in Blog component',JSON.stringify(blog))
    // eslint-disable-next-line no-unused-vars
    const userId = blog.user ? blog.user._id : ''
    const blogObject = { id: blog.id,author: blog.author,title: blog.title,url: blog.url, likes: blog.likes }

    const likeHandler = async () => {
        try{
            blogObject.likes = blogLikes + 1
            // eslint-disable-next-line no-unused-vars
            // console.log('blogObject in likehandler',JSON.stringify(blogObject))
            // console.log('blog in likehandler',JSON.stringify(blog))
            await blogService.updateBlog(blogObject)
            setBlogLikes(blogObject.likes)
        }
        catch(exception){
            console.error('error in liking the post',exception)
        }
    }
    const deleteHandler = async () => {
        const deleteBool = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
        if(deleteBool){
            try{
                // eslint-disable-next-line no-unused-vars
                const response = await blogService.deleteBlog(blog.id)
                window.location.reload()
            }
            catch(exception){
                console.error('error in deleting a blog',exception)
            }
        }
    }
    if(view){
        if(blog.user && (blog.user.username === user.username)){
            return (
                <div className="blogStyle blog" style={blogStyle}>
                    {blog.title} {blog.author} <button onClick={viewHandler}>hide</button>
                    <p className="blogUrl">{blog.url}</p>
                    <BlogLikes blogLikes = {blogLikes} likeHandler={likeHandler} />
                    {blog.user && <p>{blog.user.username}</p>}
                    <button onClick={deleteHandler}> remove </button>
                </div>
            )
        }
        return (
            <div  className="blog blogStyle" style={blogStyle}>
                {blog.title} {blog.author} <button onClick={viewHandler}>hide</button>
                <p className="blogUrl">{blog.url}</p>
                <BlogLikes blogLikes = {blogLikes} likeHandler={likeHandler} />
                {blog.user && <p>{blog.user.username}</p>}
            </div>
        )
    }
    else{
        return (
            <div className="blogStyle" style={blogStyle}>
                {blog.title} {blog.author} <button onClick={viewHandler}>view</button>
            </div>
        )
    }
}

export { Blog, BlogLikes }
