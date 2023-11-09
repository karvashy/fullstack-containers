import { useState } from 'react'

const BlogForm = ({ submitBlog, setBlogs, blogs,setMessage, setMessageType, formRef }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')
    const handleCreateClick = async () => {
        try{
            const response = await submitBlog(title,author,url)

            if (response.status === 201){
                setMessage(`a new blog ${title} by ${author} added`)
                setMessageType('message')
                setTitle('')
                setAuthor('')
                setUrl('')
                const newBlog = {
                    author,title,url,likes:0
                }
                setBlogs(blogs.concat(newBlog))
                formRef.current.toggleVisibility()
                setTimeout(() => setMessage(null), 5000)
            }
        }
        catch(exception){
            if(!title || !author){
                setMessage('Error! Author and Title fields are required')
            }
            else{
                setMessage('Error adding the blogs')
            }
            setMessageType('error')
            setTimeout(() => setMessage(null), 5000)
        }
    }

    const handleTitle = (event) => {
        setTitle(event.target.value)
    }
    const handleAuthor = (event) => {
        setAuthor(event.target.value)
    }
    const handleUrl = (event) => {
        setUrl(event.target.value)
    }

    return (
        <>
            <h1> create new </h1>
            <p>
        title:<input id="title" name="title" value={title} onChange={handleTitle} />
            </p>
            <p>
        author:<input id="author" name="author" value={author} onChange={handleAuthor}/>
            </p>
            <p>
        url:<input id="url" name="url" value={url} onChange={handleUrl} />
            </p>
            <button id="create" onClick={handleCreateClick}>Create</button>
        </>
    )
}

export default BlogForm
