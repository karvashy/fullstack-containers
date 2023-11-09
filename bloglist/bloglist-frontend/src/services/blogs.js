import axios from 'axios'
const baseUrl = '/api/blogs'

let headerValue = null

const setToken = (token) => {
    headerValue = `Bearer ${token}`
}

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const createBlog = async (title, author, url) => {
    if(!headerValue){
        console.log('authorization header is undefined')
    }
    const config = { headers:
        { 'Authorization': headerValue }
    }
    const blogObject = { title,author,url }
    const response = await axios.post(baseUrl, blogObject, config)
    return response.data
}

const updateBlog = async (bObject) => {
    console.log('updateblog input bobject',JSON.stringify(bObject))
    const bodyObject = { ...bObject }
    let id
    if(bodyObject.id){
        id = bodyObject.id
        console.log('id inside updateBlog',id)
    }
    else if(bodyObject._id){
        id = bodyObject._id
        console.log('_id inside updateBlog',id)

    }
    console.log('bodyObject in updateBlog',JSON.stringify(bodyObject))
    const response = await axios.put(baseUrl+`/${id}`,bodyObject)
    return response.data
}

const deleteBlog = async (blogId) => {
    if(!headerValue){
        console.log('authorization header is undefined')
    }
    const config = { headers: { 'Authorization': headerValue } }
    try{
        const response = await axios.delete(baseUrl+`/${blogId}`,config)
        return response.data
    }
    catch(exception){
        console.log('error in deleting the blog',exception)
    }

}


export default { getAll, setToken, createBlog, updateBlog, deleteBlog }
