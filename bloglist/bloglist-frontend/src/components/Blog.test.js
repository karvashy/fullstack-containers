import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { Blog, BlogLikes } from './Blog'
import BlogForm from './BlogForm'


test('renders the blog', () => {
    const blog = { title: 'test title', author:'test author', url: 'test url', likes: 0 }
    const user = { username: 'test' }

    const { container } = render(<Blog blog={blog} user={user}/>)
    let element = screen.queryByText('test title')
    expect(element).toBeDefined()
    element = container.querySelector('.blogStyle')
    expect(element).toHaveTextContent('test title')
    element = screen.queryByText('test author')
    expect(element).toBeDefined()
    element = screen.queryByText('test url')
    expect(element).toBeNull()
    element = container.querySelector('.blogLikes')
    expect(element).toBeNull()
    element = screen.queryByText('likes')
    expect(element).toBeNull()
})
test('renders the view of the blog', async () => {
    const blog = { title: 'test title', author:'test author', url: 'test url', 'likes': 0 }
    const user = { username: 'test' }
    const { container } = render(<Blog blog={blog} user={user}/>)

    const userObject = userEvent.setup()
    const viewButton = screen.getByText('view')
    await userObject.click(viewButton)

    const urlElement = container.querySelector('.blogUrl')
    expect(urlElement).toHaveTextContent('test url')

    const likeElement = container.querySelector('.blogLikes')
    expect(likeElement).toHaveTextContent('0')

})
test('testing the functionality of like button',async () => {
    const mockLike = jest.fn()
    render(<BlogLikes blogLikes="0" likeHandler={mockLike} />)

    const userObject = userEvent.setup()
    const likeButton = screen.getByText('like')
    await userObject.click(likeButton)

    expect(mockLike.mock.calls).toHaveLength(1)

})
test('testing the functionality of like increment' ,async () => {
    const mockLike = jest.fn()
    render(<BlogLikes blogLikes="0" likeHandler={mockLike} />)

    const userObject = userEvent.setup()
    const likeButton = screen.getByText('like')
    await userObject.click(likeButton)
    await userObject.click(likeButton)

    expect(mockLike.mock.calls).toHaveLength(2)
})

test('testing the form functionality', async () => {
    const createBlogMock = jest.fn()
    const setMessageMock = jest.fn(() => console.log('testing mock'))
    const user = userEvent.setup()
    //const blog = { title: 'test title', author:'test author', url: 'test url', 'likes': 0 }

    const { container } = render(<BlogForm submitBlog={createBlogMock} setBlogs={setMessageMock} setMessage={setMessageMock} setMessageType={setMessageMock}/>)
    const titleElement = container.querySelector('input[name="title"]')
    await user.type(titleElement, 'testing a blog title')
    const authorElement = container.querySelector('input[name="author"]')
    await user.type(authorElement, 'testing a blog author')
    const urlElement = container.querySelector('input[name="url"]')
    await user.type(urlElement, 'testing a blog url')
    const buttonElement = screen.getByText('Create')
    await user.click(buttonElement)

    expect(createBlogMock.mock.calls).toHaveLength(1)
    console.log('mock call content',createBlogMock.mock.calls[0])
    expect(createBlogMock.mock.calls[0][0]).toBe('testing a blog title')
    expect(createBlogMock.mock.calls[0][1]).toBe('testing a blog author')
    expect(createBlogMock.mock.calls[0][2]).toBe('testing a blog url')


})
