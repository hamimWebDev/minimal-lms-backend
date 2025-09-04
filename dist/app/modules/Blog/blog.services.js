"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogServices = void 0;
const blog_model_1 = require("./blog.model");
const addBlog = async (payload, file) => {
    const blogData = {
        ...payload,
        coverImage: file?.path,
    };
    const result = await blog_model_1.Blog.create(blogData);
    return result;
};
const getAllBlogs = async () => {
    const blogs = await blog_model_1.Blog.find();
    return blogs;
};
const getBlogById = async (id) => {
    const blog = await blog_model_1.Blog.findById(id);
    if (!blog) {
        throw new Error('Blog not found');
    }
    return blog;
};
const updateBlog = async (id, payload, file) => {
    const updatedData = {
        ...payload,
        ...(file && { coverImage: file.path }),
    };
    const updatedBlog = await blog_model_1.Blog.findByIdAndUpdate(id, updatedData, {
        new: true,
    });
    return updatedBlog;
};
const deleteBlog = async (id) => {
    const deletedBlog = await blog_model_1.Blog.findByIdAndDelete(id);
    return deletedBlog;
};
exports.BlogServices = {
    addBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
};
