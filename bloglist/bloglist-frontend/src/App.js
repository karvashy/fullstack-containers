import { useState, useEffect, useRef } from 'react'
import { Blog } from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification.js'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [user, setUser] = useState(null)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState('')
    const blogFormRef = useRef(null)

    useEffect(() => {
        console.log('blogs.length',blogs.length)
        blogService.getAll().then(blogs =>
            setBlogs( blogs )
        )
    }, [blogs.length])
    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
        if(loggedUserJSON){
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])
    const handleLogin = async (event) => {
        event.preventDefault()
        console.log('logging in with the username',username,'and password',password)
        try{
            const user = await loginService.login({ 'username':username,'password': password })
            setUser(user)
            blogService.setToken(user.token)
            window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
            setUsername('')
            setPassword('')

        }
        catch(exception){
            console.error('exception in login request')
            setMessage('wrong username or password')
            setMessageType('error')
            setTimeout(() => setMessage(null), 5000)
        }
    }
    const handleUsername = (event) => {
        setUsername(event.target.value)
    }
    const handlePassword = (event) => {
        setPassword(event.target.value)
    }
    const submitBlog = async (title,author,url) => {
        try{
            const response = await blogService.createBlog(title, author,url)
            return response
        }
        catch(exception){
            console.error('network side error in creating the blog',exception)
        }
    }

    const logoutHandler = () => {
        window.localStorage.removeItem('loggedBlogUser')
        window.location.reload()
    }

    if(!user){
        return (
            <div>
                <h1>log in to  application </h1>
                <Notification message={message} type={messageType} />
                <div>
            username <input id="username" name="username" value={username} onChange={handleUsername}/>
                </div>
                <div>
            password <input id="password" name="password" value={password} onChange={handlePassword}/>
                </div>
                <button id="login" onClick={handleLogin}>login</button>
            </div>
        )
    }

    const sortedBlogs = (blogs.sort((a,b) => b.likes - a.likes))

    const blogList = (sortedBlogs.map(blog =>
        <Blog class="blog" key={blog.id} blog={blog} user={user}/>))

    return (
        <div>
            <h2>blogs</h2>
            <Notification message={message} type={messageType} />
            <p> {user.username} logged in <button onClick={logoutHandler}>logout</button>
            </p>
            <Togglable buttonLabel="new blog" ref={blogFormRef}>
                <BlogForm submitBlog={submitBlog} setBlogs={setBlogs} blogs={blogs} setMessage={setMessage} setMessageType={setMessageType} formRef={blogFormRef} />
            </Togglable>
            {blogList}
        </div>
    )
}

export default App
