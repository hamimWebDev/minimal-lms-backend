import { Blog } from './blog.model'

const addBlog = async (payload: any, file: any) => {
  const blogData = {
    ...payload,
    coverImage: file?.path,
  }
  const result = await Blog.create(blogData)
  return result
}

const getAllBlogs = async () => {
  const blogs = await Blog.find()
  return blogs
}

const getBlogById = async (id: string) => {
  const blog = await Blog.findById(id)
  if (!blog) {
    throw new Error('Blog not found')
  }
  return blog
}

const updateBlog = async (id: string, payload: any, file: any) => {
  const updatedData = {
    ...payload,
    ...(file && { coverImage: file.path }),
  }
  const updatedBlog = await Blog.findByIdAndUpdate(id, updatedData, {
    new: true,
  })
  return updatedBlog
}

const deleteBlog = async (id: string) => {
  const deletedBlog = await Blog.findByIdAndDelete(id)
  return deletedBlog
}

export const BlogServices = {
  addBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
}
